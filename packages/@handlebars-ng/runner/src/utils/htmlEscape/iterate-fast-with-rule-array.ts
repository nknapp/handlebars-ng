import { illegalCharRegex, rules } from "./rules";

const charCodeReplaceArray: string[] = [];
for (const [from, to] of rules) {
  charCodeReplaceArray[from.charCodeAt(0)] = to;
}

export function escapeHtmlIterateFastWithRuleArray(string: string): string {
  const match = illegalCharRegex.exec(string);

  if (!match) {
    return string;
  }

  let result = "";
  let lastIndex = 0;
  for (let i = match.index; i < string.length; i++) {
    const replacement = charCodeReplaceArray[string.charCodeAt(i)];
    if (replacement != null) {
      if (lastIndex < i + 1) {
        result += string.substring(lastIndex, i);
      }
      result += replacement;
      lastIndex = i + 1;
    }
  }

  return result + string.substring(lastIndex);
}
