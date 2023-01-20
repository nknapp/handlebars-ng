import { bench } from "vitest";
import { renderEscapedHtml } from "./htmlEscape";
import Handlebars from "handlebars";

function unscapedChars(count: number) {
  return `${count} chars between escaped chars -------------`
    .repeat(Math.ceil(count / 40))
    .slice(0, count);
}

const strings: string[] = [
  "short string unescaped",
  "short & escape",
  "long string unescaped".repeat(10),
  (unscapedChars(5) + "<").repeat(10),
  (unscapedChars(10) + "<").repeat(10),
  (unscapedChars(20) + "<").repeat(10),
  (unscapedChars(50) + "<").repeat(10),
  (unscapedChars(100) + "<").repeat(10),
  (unscapedChars(200) + "<").repeat(10),
  (unscapedChars(500) + "<").repeat(10),
  (unscapedChars(1000) + "<").repeat(10),
];

// In order to run performance tests, add another htmlEscape function and a "bench" call here and run with "yarn vitest bench"
describe("htmlEscape benchmarks", () => {
  for (const string of strings) {
    describe(`${string.substring(0, 50)} (${string.length} chars)`, () => {
      bench("htmlEscape", () => {
        renderEscapedHtml(string, { output: "" });
      });

      bench("original", () => {
        Handlebars.escapeExpression(string);
      });
    });
  }
});
