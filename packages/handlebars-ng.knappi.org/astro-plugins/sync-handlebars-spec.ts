import { AstroIntegration } from "astro";

import path from "path";
import { SyncFile, TITLE_NONE } from "./lib/SyncFile";
import { SyncDirs } from "./lib/SyncDirs";

import { Grammar, EmitFormat } from "grammarkdown";

const specSourceDir = path.resolve("../@handlebars-ng/specification/src/spec");
const specTargetDir = path.resolve("src/pages/spec");

export function syncHandlebarsSpec(): AstroIntegration {
  return {
    name: "handlebars-spec",
    hooks: {
      "astro:config:setup": async ({ isRestart, command }) => {
        if (isRestart) return;

        if (command === "dev" || command === "build") {
          const syncDirs = new SyncDirs(
            specSourceDir,
            specTargetDir,
            applyTransformations
          );
          await syncDirs.syncAllFilesFromSpec();

          if (command === "dev") {
            syncDirs.watch();
          }
        }
      },
    },
  };
}

async function applyTransformations(file: SyncFile): Promise<void> {
  switch (file.originalExt) {
    case ".md":
      file.updateExtension(".mdx");
      file.addFrontMatter();
      break;
    case ".ts":
      file.updateExtension(".mdx");
      file.wrapContentInFences("typescript");
      file.addFrontMatter(TITLE_NONE);
      break;
    case ".json":
      break;
    case ".txt":
      break;
    case ".grammar":
      file.updateExtension(".mdx");
      await file.transform(grammarToMarkdown);
      file.addFrontMatter();
      break;
    default:
      throw new Error(
        "Unknown file type for transformation: " + file.relativePath
      );
  }
}

function escapeOpeningBraces(content: string): string {
  return content
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/\\/g, "&#92;")
    .replace(/`/g, "&#96;");
}

async function grammarToMarkdown(content: string): Promise<string> {
  const html = await Grammar.convert(content, { format: EmitFormat.html });
  return `# Syntax grammar\n\n**work in progress**\n\n<br/>${escapeOpeningBraces(
    html
  )}`;
}
