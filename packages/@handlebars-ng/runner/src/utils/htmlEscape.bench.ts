import { bench } from "vitest";
import { escapeHtmlFromNpm } from "./htmlEscape/escape-html-npm-package";
import { escapeHtmlIterateSwitchPlusEquals } from "./htmlEscape/iterate-chars-and-switch";
import { escapeHtmlIterateMapGetPlusEquals } from "./htmlEscape/iterate-chars-with-map";
import { escapeHtmlIterateFastWithRuleArray } from "./htmlEscape/iterate-fast-with-rule-array";
import { escapeHtmlRegexpExec } from "./htmlEscape/re-exec";
import { escapeHtmlReplaceAll } from "./htmlEscape/replaceAll";
import { escapeHtmlReplaceRegexp } from "./htmlEscape/string-replace-regex";
import { escapeHtmlUint8Array } from "./htmlEscape/type-array-utf-8";
import { escapeHtmlUint16Array } from "./htmlEscape/typed-array-utf16";

for (let i = 0; i < 3; i++) {
  const string =
    "ab< ad asd asd asd asd asd =a dsa asd asd ad a>d ad asd asd \"asd asd asd 'asd` asd ad asd c".repeat(
      Math.pow(20, i)
    );
  describe("htmlEscape " + string.length, () => {
    bench("replaceAll", () => {
      escapeHtmlReplaceAll(string);
    });

    bench("iterate", () => {
      escapeHtmlIterateMapGetPlusEquals(string);
    });

    bench("iterateSwitch", () => {
      escapeHtmlIterateSwitchPlusEquals(string);
    });

    bench("escapeHtmlReReplace", () => {
      escapeHtmlReplaceRegexp(string);
    });

    bench("re-exec", () => {
      escapeHtmlRegexpExec(string);
    });

    bench("typedArray", () => {
      escapeHtmlUint8Array(string);
    });

    bench("uint16array", () => {
      escapeHtmlUint16Array(string);
    });

    bench("fromNpm", () => {
      escapeHtmlFromNpm(string);
    });

    bench("iterate-fast-with-rule-array", () => {
      escapeHtmlIterateFastWithRuleArray(string);
    });
  });
}
