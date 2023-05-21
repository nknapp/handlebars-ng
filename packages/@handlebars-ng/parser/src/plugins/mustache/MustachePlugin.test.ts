import { createHandlebarsParser } from "../../core/createHandlebarsParser";
import { MustachePluginEscaped } from "./MustachePlugin";
import { loc } from "../../test-utils/loc";
import { MustacheStatement } from "@handlebars-ng/abstract-syntax-tree";
import { PathExpressionPlugin } from "../pathExpression/PathExpressionPlugin";

describe("MustachePlugin", () => {
  it("parses {{ mustache statements", () => {
    const parser = createHandlebarsParser({
      plugins: [MustachePluginEscaped, PathExpressionPlugin],
    });
    const ast = parser.parse("{{abc}}");
    expect(ast.body).toEqual([
      {
        type: "MustacheStatement",
        loc: loc("1:0-1:7"),
        params: [],
        strip: { open: false, close: false },
        escaped: true,
        path: {
          type: "PathExpression",
          loc: loc("1:2-1:5"),
          original: "abc",
          parts: ["abc"],
          data: false,
          depth: 0,
        },
      } satisfies MustacheStatement,
    ]);
  });
});
