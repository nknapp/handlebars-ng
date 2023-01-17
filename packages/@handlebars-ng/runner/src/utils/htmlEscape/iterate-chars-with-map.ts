import { rules } from "./rules";

const escapeRules: Map<string, string> = new Map(rules);
export function escapeHtmlIterateMapGetPlusEquals(string: string): string {
  let result = "";
  for (const char of string) {
    result += escapeRules.get(char) ?? char;
  }
  return result;
}
