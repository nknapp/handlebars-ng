import { SourceLocation } from "@handlebars-ng/abstract-syntax-tree";

export function loc(range: string): SourceLocation {
  const [start, end] = range.split("-").map((position) => {
    const [line, column] = position.split(":").map(Number);
    return { line, column };
  });
  return { start, end };
}
