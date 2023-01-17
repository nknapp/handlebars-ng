import { RenderContext } from "../renderer/RenderContext";
import { escapeHtmlFromNpm } from "./htmlEscape/escape-html-npm-package";

const rules: [string, string][] = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#x27;"],
  ["`", "&#x60;"],
  ["=", "&#x3D;"],
];
const escapeRules: Map<string, string> = new Map(rules);

const illegalChars = Array.from(escapeRules.keys()).join("");
const illegalCharRegex = new RegExp("[" + illegalChars + "]", "g");

export function renderHtmlEscaped(
  string: string,
  renderContext: RenderContext
): void {
  if (illegalCharRegex.test(string)) {
    renderContext.output += escapeHtmlFromNpm(string);
  } else {
    renderContext.output += string;
  }
}
