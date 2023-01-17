import { rules } from "./rules";

const illegalChars = rules.map((x) => x[0]).join("");
export const illegalCharRegex = new RegExp("[" + illegalChars + "]", "g");

const escapeRules: Map<string, string> = new Map(rules);
export function escapeHtmlRegexpExec(string: string): string {
  illegalCharRegex.lastIndex = 0;
  let result = "";

  let last = 0;
  let match = illegalCharRegex.exec(string);
  while (match != null) {
    result += string.slice(last, match?.index);
    result += escapeRules.get(match[0]);
    last = illegalCharRegex.lastIndex;
    match = illegalCharRegex.exec(string);
  }
  result += string.substring(last);
  return result;
}
