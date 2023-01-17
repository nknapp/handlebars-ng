import { illegalCharRegexGlobal, rules } from "./rules";

const escapeRules: Map<string, string> = new Map(rules);

export function escapeHtmlReplaceRegexp(string: string): string {
  return string.replace(
    illegalCharRegexGlobal,
    (char) => escapeRules.get(char) ?? char
  );
}
