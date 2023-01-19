import { htmlEscape } from "./htmlEscape";

const input = "tä ฤ 🍓 😅 & xx <>\"'`= abc";
const expected = "tä ฤ 🍓 😅 &amp; xx &lt;&gt;&quot;&#x27;&#x60;&#x3D; abc";

describe("htmlEscape", () => {
  it("short string", () => {
    expect(htmlEscape(input)).toBe(expected);
  });

  it("long string", () => {
    expect(htmlEscape(input.repeat(100))).toBe(expected.repeat(100));
  });
});
