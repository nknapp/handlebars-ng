import { RenderContext } from "../renderer/RenderContext";

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
    if (string.length < 200) {
      renderContext.output += iterate(string);
    } else {
      renderContext.output += typedArray(string);
    }
  } else {
    renderContext.output += string;
  }
}

export function escapeHtml(string: string): string {
  let result = string;
  for (const [find, replace] of rules) {
    result = result.replaceAll(find, replace);
  }
  return result;
}

export function escapeHtmlReReplace(string: string): string {
  return string.replace(
    illegalCharRegex,
    (char) => escapeRules.get(char) ?? char
  );
}

export function iterate(string: string): string {
  let result = "";
  for (const char of string) {
    result += escapeRules.get(char) ?? char;
  }
  return result;
}

export function iterateSwitch(string: string): string {
  let result = "";
  for (const char of string) {
    switch (char) {
      case "&":
        result += "&amp;";
        break;
      case "<":
        result += "&lt;";
        break;
      case ">":
        result += "&gt;";
        break;
      case '"':
        result += "&quot;";
        break;
      case "'":
        result += "&#x27;";
        break;
      case "`":
        result += "&#x60;";
        break;
      case "=":
        result += "&#x3D;";
        break;
      default:
        result += char;
    }
  }
  return result;
}

export function reExec(string: string): string {
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
  return result;
}

const charCodeReplaceArray: number[][] = [];
for (const [from, to] of rules) {
  charCodeReplaceArray[from.charCodeAt(0)] = to
    .split("")
    .map((x) => x.charCodeAt(0));
}
let buffer: { source: Uint8Array; target: Uint8Array } | null = null;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
export function typedArray(string: string): string {
  if (buffer == null || buffer.source.length < string.length * 4) {
    buffer = {
      source: new Uint8Array(string.length * 4),
      target: new Uint8Array(string.length * 16),
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
