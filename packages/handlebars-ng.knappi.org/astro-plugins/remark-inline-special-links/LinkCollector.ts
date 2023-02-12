import { SpecialLinkConfig, SpecialLinksConfig } from "./types";
import path from "node:path";

export interface JsxComponentCall {
  jsxElementName: string;
  props: Record<string, PropValue>;
}

export interface PropValue {
  type: "string" | "identifier";
  value: string;
}

export interface ImportSpec {
  name: string;
  source: string;
}

export const FILENAME = Symbol("linkcollector-filename");
export const DATA = Symbol("linkcollector-data");
export const HASH = Symbol("linkcollector-hash");

export class LinkCollector {
  sourceFile: string;
  config: SpecialLinksConfig;
  imports: Imports;

  constructor(sourceFile: string, config: SpecialLinksConfig) {
    this.sourceFile = sourceFile;
    this.config = config;
    this.imports = new Imports();
  }

  replacementForLink(linkTarget: string): JsxComponentCall | null {
    for (const linkConfig of this.config.links) {
      if (linkConfig.match.test(linkTarget)) {
        const jsxElementName = this.imports.lazyCreateImportVar(
          linkConfig.component
        );
        return {
          jsxElementName: jsxElementName,
          props: mapValues(linkConfig.propMapping, (configValue) => {
            return this.getPropValue(linkConfig, configValue, linkTarget);
          }),
        };
      }
    }
    return null;
  }

  get importsRequired(): boolean {
    return this.imports.size > 0;
  }

  private getPropValue(
    linkConfig: SpecialLinkConfig,
    value: symbol,
    linkTarget: string
  ): PropValue {
    const [linkPath, hash] = linkTarget.split("#");

    switch (value) {
      case FILENAME:
        return this.stringProp(this.relativePath(linkPath));
      case DATA: {
        const query = linkConfig.dataImportQuery ?? "";
        return this.importedVariableProp(linkPath + query);
      }
      case HASH: {
        return this.stringProp(hash);
      }
      default:
        throw new Error("Unexpected prop value symbol " + value.toString());
    }
  }

  private importedVariableProp(linkTarget: string): PropValue {
    return {
      type: "identifier",
      value: this.imports.lazyCreateImportVar(linkTarget),
    };
  }

  private relativePath(filename: string): string {
    const fullPath = path.join(path.dirname(this.sourceFile), filename);
    return path.relative(this.config.baseDir, fullPath);
  }

  private stringProp(value: string): PropValue {
    return {
      type: "string",
      value: value,
    };
  }
}

function mapValues<Input, Output>(
  input: Record<string, Input>,
  mapFn: (value: Input) => Output
): Record<string, Output> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, mapFn(value)])
  );
}

class Imports implements Iterable<ImportSpec> {
  importSourceToVariableName = new Map<string, string>();

  lazyCreateImportVar(importSource: string): string {
    const existingName = this.importSourceToVariableName.get(importSource);
    if (existingName != null) return existingName;

    const newName = importSource.replace(/\W/g, "_");
    this.importSourceToVariableName.set(importSource, newName);
    return newName;
  }

  get size() {
    return this.importSourceToVariableName.size;
  }

  *[Symbol.iterator]() {
    for (const [source, name] of this.importSourceToVariableName.entries()) {
      yield { source, name };
    }
  }
}
