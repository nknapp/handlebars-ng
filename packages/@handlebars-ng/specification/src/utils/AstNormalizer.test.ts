import { describe, expect, it } from "vitest";
import { Normalizer } from "./AstNormalizer";

describe("Normalizer", () => {
  it("joins consecutive content-statements", () => {
    const ast = createProgram(
      [
        createContent("abc ", loc("1:0 - 1:4")),
        createContent("c", loc("1:4 - 1:5")),
        createContent("d", loc("1:5 - 1:6")),
        createContent("e", loc("1:6 - 1:7")),
      ],
      loc("1:0 - 1:7")
    );

    new Normalizer().accept(ast as hbs.AST.Program);
    expect(ast).toEqual(
      createProgram(
        [createContent("abc cde", loc("1:0 - 1:7"))],
        loc("1:0 - 1:7")
      )
    );
  });

  it("joins each group of content-statements", () => {
    const ast = createProgram(
      [
        createContent("abc ", loc("1:0 - 1:4")),
        createContent("c", loc("1:4 - 1:5")),
        createContent("d", loc("1:5 - 1:6")),
        createContent("e", loc("1:6 - 1:7")),
        createComment("{{! hi }}", loc("1:7 - 1:16")),
        createContent("c", loc("1:16 - 1:17")),
        createContent("d", loc("1:17 - 1:18")),
        createContent("e", loc("1:18 - 1:19")),
      ],
      loc("1:0 - 1:19")
    );

    new Normalizer().accept(ast as hbs.AST.Program);
    expect(ast).toEqual(
      createProgram(
        [
          createContent("abc cde", loc("1:0 - 1:7")),
          createComment("{{! hi }}", loc("1:7 - 1:16")),
          createContent("cde", loc("1:16 - 1:19")),
        ],
        loc("1:0 - 1:19")
      )
    );
  });
});

function createProgram(
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

function createContent(
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

function createComment(
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

type PositionAsString = `${number}:${number}`;
type LocationAsString = `${PositionAsString} - ${PositionAsString}`;

/**
 * Parses "1:0 - 2:7" into { start: { line: 1, column: 0}, end: { line: 2, column: 7 }}
 */
function loc(string: LocationAsString): hbs.AST.SourceLocation {
  const [startString, endString] = string.split("-");
  if (startString == null) throw new Error("No start-position found");
  if (endString == null) throw new Error("No end-position found");
  return {
    start: parsePosition(startString),
    end: parsePosition(endString),
  };
}

function parsePosition(pos: string): hbs.AST.Position {
  const [line, column] = pos.split(":").map(parseInt);
  if (line == null) throw new Error("No line-number found");
  if (column == null) throw new Error("No column number found");
  return {
    line,
    column,
  };
}
