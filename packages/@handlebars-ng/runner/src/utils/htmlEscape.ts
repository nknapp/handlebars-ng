import { RenderContext } from "../renderer/RenderContext";

const escapeRules: Map<string, string> = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#x27;"],
  ["`", "&#x60;"],
  ["=", "&#x3D;"],
]);

const illegalChars = Array.from(escapeRules.keys()).join("");
const illegalCharRegex = new RegExp("[" + illegalChars + "]", "g");

export function renderHtmlEscaped(
  string: string,
  renderContext: RenderContext
): void {
  if (!illegalCharRegex.test(string)) {
    renderContext.output += string;
    return;
  }
  for (const char of string) {
    renderContext.output += escapeRules.get(char) ?? char;
  }
}
