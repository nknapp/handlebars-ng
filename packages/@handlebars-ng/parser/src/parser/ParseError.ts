import { Location } from "../lexer";

export class ParseError extends Error {
  location: Location;

  constructor(message: string, location: Location, template: string) {
    super(message + createMessageSuffix(template, location));
    this.location = location;
  }
}

function createMessageSuffix(template: string, location?: Location) {
  if (location == null) return " in template\n-----\n" + template;

  return (
    ` at ${location.line}:${location.column}\n-----\n` +
    new Snippet(template, location).toString()
  );
}

class Snippet {
  private readonly contextLines = 2;
  private template: string;
  private location: Location;
  private startLine: number;
  private endLine: number;
  private lineNumberPadding: number;

  constructor(template: string, location: Location) {
    this.template = template;
    this.location = location;
    this.startLine = Math.max(location.line - this.contextLines, 1);
    this.endLine = location.line + this.contextLines + 1;
    this.lineNumberPadding = String(this.endLine).length;
  }

  toString(): string {
    const lines = this.template.split("\n");
    let result = "";
    for (let i = this.startLine; i < this.endLine; i++) {
      if (i < 1) continue;
      if (i > lines.length) break;
      result += `${this.pad(i)}| ${lines[i - 1]}\n`;
      if (i === this.location.line) {
        result += `${this.pad("-")}+-${this.marker()}\n`;
      }
    }
    return result.trimEnd();
  }

  private pad(value: number | string) {
    return String(value).padStart(this.lineNumberPadding);
  }

  private marker() {
    return "-".repeat(this.location.column) + "^";
  }
}
