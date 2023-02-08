import path from "node:path";

const __filename = new URL(import.meta.url).pathname;

export const TITLE_FROM_H1 = Symbol("Header from first h1");
export const TITLE_NONE = Symbol("No header");
export type HeaderSpec = string | typeof TITLE_FROM_H1 | typeof TITLE_NONE;

const OMIT_LINE = Symbol("Omit line");
type LineSpec = string | typeof OMIT_LINE;

export class SyncFile {
  relativePath: string;
  contents: string;
  originalExt: string;

  constructor(relativePath: string, contents: string) {
    this.relativePath = relativePath;
    this.contents = contents;
    this.originalExt = path.extname(relativePath);
  }

  updateExtension(newExtension: string): void {
    this.relativePath = this.relativePath.replace(/\.\w+$/, newExtension);
  }

  wrapContentInFences(language: string): void {
    if (this.contents.match(/```/))
      throw new Error(
        "Content already contains fences. This is currently not supported"
      );

    const title = capitalize(
      path.basename(this.relativePath, path.extname(this.relativePath))
    );
    this.updateContents(
      `# ${title}`,
      ``,
      "```" + language,
      this.contents,
      "```"
    );
  }

  async transform(
    fn: (contents: string) => Promise<string> | string
  ): Promise<void> {
    this.contents = await fn(this.contents);
  }

  private titleFromFilename() {
    return capitalize(path.basename(this.relativePath));
  }

  addFrontMatter(header: HeaderSpec = TITLE_FROM_H1): void {
    this.updateContents(
      `---`,
      ``,
      `# DO NOT EDIT THIS FILE MANUALLY`,
      `# generated by "${generator()}"`,
      this.frontmatterTitleLine(header),
      `layout: "@/layouts/SpecLayout.astro"`,
      ``,
      `---`,
      ``,
      this.contents
    );
  }

  private updateContents(...lines: LineSpec[]): void {
    this.contents = lines.filter((line) => line !== OMIT_LINE).join("\n");
  }

  private frontmatterTitleLine(header: HeaderSpec): LineSpec {
    if (header === TITLE_NONE) {
      return OMIT_LINE;
    } else if (header === TITLE_FROM_H1) {
      return `title: ${JSON.stringify(this.titleFromFirstH1())}`;
    } else {
      return `title: ${JSON.stringify(header)}`;
    }
  }

  private titleFromFirstH1() {
    const headerMatch = this.contents.match(/^# (.*)$/m);
    if (headerMatch == null) {
      throw new Error("No '#'-Header found in file " + this.relativePath);
    }
    return headerMatch[1];
  }
}

function generator(): string {
  return path.relative(process.cwd(), __filename);
}

function capitalize(string: string): string {
  return string[0].toLocaleUpperCase() + string.slice(1);
}
