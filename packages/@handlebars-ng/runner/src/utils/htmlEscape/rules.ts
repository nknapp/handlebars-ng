export const rules: [string, string][] = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#x27;"],
  ["`", "&#x60;"],
  ["=", "&#x3D;"],
];

const illegalChars = rules.map((x) => x[0]).join("");
export const illegalCharRegexGlobal = new RegExp("[" + illegalChars + "]", "g");
export const illegalCharRegex = new RegExp("[" + illegalChars + "]");
