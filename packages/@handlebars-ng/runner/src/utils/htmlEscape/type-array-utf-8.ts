import { rules } from "./rules";

const charCodeReplaceArray: number[][] = [];
for (const [from, to] of rules) {
  charCodeReplaceArray[from.charCodeAt(0)] = to
    .split("")
    .map((x) => x.charCodeAt(0));
}
let buffer: { source: Uint8Array; target: Uint8Array } | null = null;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function escapeHtmlUint8Array(string: string): string {
  if (buffer == null || buffer.source.length < string.length * 4) {
    buffer = {
      source: new Uint8Array(string.length * 4),
      target: new Uint8Array(string.length * 4 * 6),
    };
  }
  const { written } = textEncoder.encodeInto(string, buffer.source);
  let s = 0;
  let t = 0;
  while (s < written) {
    const current = buffer.source[s++];
    if (current >= 0b11000000) {
      buffer.target[t++] = current;
      buffer.target[t++] = buffer.source[s++];
    } else if (current >= 0b11100000) {
      buffer.target[t++] = current;
      buffer.target[t++] = buffer.source[s++];
      buffer.target[t++] = buffer.source[s++];
    } else if (current >= 0b11110000) {
      buffer.target[t++] = current;
      buffer.target[t++] = buffer.source[s++];
      buffer.target[t++] = buffer.source[s++];
      buffer.target[t++] = buffer.source[s++];
    } else {
      const replacement: number[] | undefined = charCodeReplaceArray[current];
      if (replacement != null) {
        for (let i = 0; i < replacement.length; i++) {
          buffer.target[t++] = replacement[i];
        }
      } else {
        buffer.target[t++] = current;
      }
    }
  }

  return textDecoder.decode(buffer.target.slice(0, t));
}
