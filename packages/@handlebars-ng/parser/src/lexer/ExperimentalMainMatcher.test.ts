import { describe, it } from "vitest";
import { ExperimentalMainMatcher } from "./ExperimentalMainMatcher";
import { Match } from "baa-lexer";
import { HbsLexerTypes } from "./rules";

describe("MainMatcher", () => {
  it("does not match a string without open curly braces", () => {
    expect(new ExperimentalMainMatcher().match("abc", 0)).toBeNull();
  });

  it("it finds opening mustache '{{' ", () => {
    expect(new ExperimentalMainMatcher().match("abc {{ abc", 0)).toEqual({
      rule: { type: "OPEN", next: "mustache" },
      text: "{{",
      offset: 4,
    } satisfies Match<HbsLexerTypes>);
  });

  it("starts searching at offset", () => {
    expect(new ExperimentalMainMatcher().match("abc {{ abc {{", 7)).toEqual({
      rule: { type: "OPEN", next: "mustache" },
      text: "{{",
      offset: 11,
    } satisfies Match<HbsLexerTypes>);
  });

  it("ignores '{' ", () => {
    expect(new ExperimentalMainMatcher().match("abc { abc", 0)).toBeNull();
  });

  it("return 'ESCAPED_MUSTACHE' for '\\{{' ", () => {
    const match = new ExperimentalMainMatcher().match("abc \\{{ abc", 0);
    expect(match).toEqual({
      rule: expect.objectContaining({ type: "ESCAPED_MUSTACHE" }),
      text: "\\{{",
      offset: 4,
    } satisfies Match<HbsLexerTypes>);

    expect(match?.rule.value?.("\\{{")).toEqual("{{");
  });

  it("returns '', for '{{{'", () => {
    expect(new ExperimentalMainMatcher().match("abc {{{ abc", 0)).toEqual({
      rule: { type: "OPEN_UNESCAPED", next: "unescapedMustache" },
      text: "{{{",
      offset: 4,
    } satisfies Match<HbsLexerTypes>);
  });
});
