import { Location } from "../types";

export function endLocationMultiline(
  startPosition: Location,
  substring: string
): Location {
  const lines = substring.split(/\n/);
  const nrLines = lines.length - 1;
  if (nrLines > 0) {
    const lastLine = lines[lines.length - 1];
    return {
      line: startPosition.line + nrLines,
      column: lastLine.length,
    };
  }
  return {
    line: startPosition.line,
    column: startPosition.column + substring.length,
  };
}
