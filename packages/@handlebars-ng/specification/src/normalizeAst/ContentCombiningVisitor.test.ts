import { describe, expect, it } from "vitest";
import {
  createComment,
  createContent,
  createProgram,
  loc,
} from "../test-utils/ast.test-helper";
import { ContentCombiningVisitor } from "./ContentCombiningVisitor";

describe("Normalizer", () => {
  it("joins consecutive content-statements", () => {
    const ast = createProgram(
      [
        createContent("abc ", loc("1:0 - 1:4")),
        createContent("c", loc("1:4 - 1:5")),
        createContent("d", loc("1:5 - 1:6")),
        createContent("e", loc("1:6 - 1:7")),
      ],
      loc("1:0 - 1:7"),
    );

    new ContentCombiningVisitor().accept(ast as hbs.AST.Program);
    expect(ast).toEqual(
      createProgram(
        [createContent("abc cde", loc("1:0 - 1:7"))],
        loc("1:0 - 1:7"),
      ),
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
      loc("1:0 - 1:19"),
    );

    new ContentCombiningVisitor().accept(ast as hbs.AST.Program);
    expect(ast).toEqual(
      createProgram(
        [
          createContent("abc cde", loc("1:0 - 1:7")),
          createComment("{{! hi }}", loc("1:7 - 1:16")),
          createContent("cde", loc("1:16 - 1:19")),
        ],
        loc("1:0 - 1:19"),
      ),
    );
  });
});
