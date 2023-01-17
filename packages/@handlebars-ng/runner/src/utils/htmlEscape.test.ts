import { escapeHtmlFromNpm } from "./htmlEscape/escape-html-npm-package";
import { escapeHtmlIterateSwitchPlusEquals } from "./htmlEscape/iterate-chars-and-switch";
import { escapeHtmlIterateMapGetPlusEquals } from "./htmlEscape/iterate-chars-with-map";
import { escapeHtmlIterateFastWithRuleArray } from "./htmlEscape/iterate-fast-with-rule-array";
import { escapeHtmlRegexpExec } from "./htmlEscape/re-exec";
import { escapeHtmlReplaceAll } from "./htmlEscape/replaceAll";
import { escapeHtmlReplaceRegexp } from "./htmlEscape/string-replace-regex";
import { escapeHtmlUint8Array } from "./htmlEscape/type-array-utf-8";
import { escapeHtmlUint16Array } from "./htmlEscape/typed-array-utf16";

const input = "tä ฤ 🍓 😅 & xx <>\"'`= abc";
const expected = "tä ฤ 🍓 😅 &amp; xx &lt;&gt;&quot;&#x27;&#x60;&#x3D; abc";

describe("htmlEscape", () => {
  it("htmlEscape", () => {
    expect(escapeHtmlReplaceAll(input)).toEqual(expected);
  });

  it("escapeHtmlReReplace", () => {
    expect(escapeHtmlReplaceRegexp(input)).toEqual(expected);
  });

  it("iterate", () => {
    expect(escapeHtmlIterateMapGetPlusEquals(input)).toEqual(expected);
  });

  it("iterateSwitch", () => {
    expect(escapeHtmlIterateSwitchPlusEquals(input)).toEqual(expected);
  });

  it("reExec", () => {
    expect(escapeHtmlRegexpExec(input)).toEqual(expected);
  });

  it("uint8array text-decoder", () => {
    expect(escapeHtmlUint8Array(input)).toEqual(expected);
  });

  it("uint16array", () => {
    expect(escapeHtmlUint16Array(input)).toEqual(expected);
  });

  it("fromNpm", () => {
    expect(escapeHtmlFromNpm(input)).toEqual(expected);
  });

  it("iterate-fast-with-rule-array", () => {
    expect(escapeHtmlIterateFastWithRuleArray(input)).toEqual(expected);
  });
});
