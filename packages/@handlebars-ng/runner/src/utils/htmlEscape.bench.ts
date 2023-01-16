import { bench } from "vitest";
import {
  escapeHtml,
  escapeHtmlReReplace,
  iterate,
  iterateSwitch,
  typedArray,
} from "./htmlEscape";

for (let i = 0; i < 3; i++) {
  const string = "ab<=>\"'`c".repeat(i * 10 + 10);
  describe("htmlEscape " + string.length, () => {
    bench("replaceAll", () => {
      escapeHtml(string);
    });

    bench("iterate", () => {
      iterate(string);
    });

    bench("iterateSwitch", () => {
      iterateSwitch(string);
    });

    bench("escapeHtmlReReplace", () => {
      escapeHtmlReReplace(string);
    });

    bench("typedArray", () => {
      typedArray(string);
    });
  });
}
