export function createProgram(
  body: hbs.AST.Statement[],
  loc: hbs.AST.SourceLocation
): hbs.AST.Program {
  return {
    type: "Program",
    blockParams: [],
    body,
    strip: {},
    loc,
  };
}

export function createContent(
  text: string,
  loc: hbs.AST.SourceLocation
): hbs.AST.ContentStatement {
  return {
    type: "ContentStatement",
    original: text,
    value: text,
    loc,
  };
}

export function createComment(
  comment: string,
  loc: hbs.AST.SourceLocation
): hbs.AST.CommentStatement {
  return {
    type: "CommentStatement",
    value: comment,
    loc: loc,
    strip: { close: false, open: false },
  };
}

export type PositionAsString = `${number}:${number}`;
export type LocationAsString = `${PositionAsString} - ${PositionAsString}`;

/**
 * Parses "1:0 - 2:7" into { start: { line: 1, column: 0}, end: { line: 2, column: 7 }}
 */
export function loc(string: LocationAsString): hbs.AST.SourceLocation {
  const [startString, endString] = string.split("-");
  if (startString == null) throw new Error("No start-position found");
  if (endString == null) throw new Error("No end-position found");
  return {
    start: parsePosition(startString),
    end: parsePosition(endString),
  };
}

export function parsePosition(pos: string): hbs.AST.Position {
  const [line, column] = pos.split(":").map(parseInt);
  if (line == null) throw new Error("No line-number found");
  if (column == null) throw new Error("No column number found");
  return {
    line,
    column,
  };
}
