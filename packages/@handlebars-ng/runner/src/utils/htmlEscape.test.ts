import Handlebars from "handlebars";
import { renderEscapedHtml } from "./htmlEscape";

const input = "tä ฤ 🍓 😅 & xx <>\"'`= abc";
const expected = "tä ฤ 🍓 😅 &amp; xx &lt;&gt;&quot;&#x27;&#x60;&#x3D; abc";

describe("htmlEscape", () => {
  function escapeHtml(string: string): string {
    const context = { output: "" };
    renderEscapedHtml(string, context);
    return context.output;
  }

  it("short string", () => {
    expect(escapeHtml(input)).toBe(expected);
  });

  it("long string", () => {
    expect(escapeHtml(input.repeat(100))).toBe(expected.repeat(100));
  });
});

describe("escapeExpression (Handlebars 4.x)", () => {
  it("short string", () => {
    expect(Handlebars.escapeExpression(input)).toBe(expected);
  });

  it("long string", () => {
    expect(Handlebars.escapeExpression(input.repeat(100))).toBe(
      expected.repeat(100),
    );
  });
});
