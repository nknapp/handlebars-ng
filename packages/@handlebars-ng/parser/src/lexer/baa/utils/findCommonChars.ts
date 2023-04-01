export function findCommonChar(
  strings: string[]
): { char: string; maxIndex: number } | null {
  for (const char of strings[0]) {
    if (strings.every((string) => string.includes(char))) {
      const indexes = strings.map((string) => string.indexOf(char));
      return {
        char,
        maxIndex: Math.max(...indexes),
      };
    }
  }
  return null;
}
