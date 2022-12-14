const escapeRules: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;",
  "=": "&#x3D;",
} as const;

const illegalChars = Object.keys(escapeRules);

const illegalCharRegex = new RegExp("[" + illegalChars + "]", "g");

export function htmlEscape(string: string): string {
  return string.replace(illegalCharRegex, (char) => escapeRules[char]);
}
