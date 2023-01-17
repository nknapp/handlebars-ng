import { rules } from "./rules";

const charCodeReplaceArray: number[][] = [];
for (const [from, to] of rules) {
  charCodeReplaceArray[from.charCodeAt(0)] = to
    .split("")
    .map((x) => x.charCodeAt(0));
}

let uint16Array = new Uint16Array(0);
export function escapeHtmlUint16Array(string: string): string {
  if (uint16Array.length < string.length * 6) {
    uint16Array = new Uint16Array(string.length * 6);
  }
  let t = 0;

  for (const char of string) {
    if (char.length === 2) {
      uint16Array[t++] = char.charCodeAt(0);
      uint16Array[t++] = char.charCodeAt(1);
    } else {
      const current = char.charCodeAt(0);
      const replacement: number[] | undefined = charCodeReplaceArray[current];
      if (replacement != null) {
        for (let i = 0; i < replacement.length; i++) {
          uint16Array[t++] = replacement[i];
        }
      } else {
        uint16Array[t++] = current;
      }
    }
  }
  return new TextDecoder("utf-16").decode(uint16Array.slice(0, t));
}
