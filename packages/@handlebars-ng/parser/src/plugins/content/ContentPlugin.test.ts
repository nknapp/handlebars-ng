import { createHandlebarsParser } from "../../core/createHandlebarsParser";
import { ContentPlugin } from "./ContentPlugin";
import { loc } from "../../test-utils/loc";

describe("ContentPlugin", () => {
  it("parses content", () => {
    const parser = createHandlebarsParser({ plugins: [ContentPlugin] });
    const ast = parser.parse("abc");
    expect(ast.body).toEqual([
      {
        type: "ContentStatement",
        loc: loc("1:0-1:3"),
        original: "abc",
        value: "abc",
      },
    ]);
  });
});
