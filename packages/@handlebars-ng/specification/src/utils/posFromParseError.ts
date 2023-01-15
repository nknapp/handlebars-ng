import { Position } from "types/ast";

export function posFromParseError(error: Error): Position {
  const [parseErrorMsg, ignoredCodeLine, marker, ignoredExpectations] =
    error.message.split("\n");
  const [lineAsString] = getMatchingGroups(parseErrorMsg, /on line (\d+)/);
  if (!/^-*\^$/.test(marker)) {
    throw new Error("Marker should have form '---^'");
  }
  const column = marker.length;
  return { line: parseInt(lineAsString), column };
}

function getMatchingGroups(string: string, regex: RegExp) {
  const match = string.match(regex);
  if (match == null) throw new Error(`"${string}" does not match ${regex}`);
  return match.slice(1);
}
