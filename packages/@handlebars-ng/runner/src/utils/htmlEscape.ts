/**
 * (The MIT License)

Copyright (c) 2012-2013 TJ Holowaychuk
Copyright (c) 2015 Andreas Lubbe
Copyright (c) 2015 Tiancheng "Timothy" Gu

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Adjusted by Nils Knappmeier

*/

import { RenderContext } from "../types/nodeMapping";

const rules: [string, string][] = [
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
  ["'", "&#x27;"],
  ["`", "&#x60;"],
  ["=", "&#x3D;"],
];
const illegalCharsRegex = /[&<>"'`=]/;
const illegalCharsRegexGlobal = /[&<>"'`=]/g;

const escapeRules: Map<string, string> = new Map(rules);

function replaceChar(char: string): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return escapeRules.get(char)!;
}

/**
 * Escape special characters in the given string of text.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

export function renderEscapedHtml(
  str: string,
  context: Pick<RenderContext, "output">
): void {
  // Checking for illegal chars with a non-global regex. Covers most cases and
  // is faster than regex-replace or iteration
  if (!illegalCharsRegex.test(str)) {
    context.output += str;
    return;
  }

  // For long strings with few replacements, a regex is faster
  if (str.length > 50) {
    context.output += str.replace(illegalCharsRegexGlobal, replaceChar);
    return;
  }

  // Fast iteration for short strings (inspired by from npm:escape-html)
  let escape = "";
  let index = 0;
  let lastIndex = 0;
  for (index = 0; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = "&quot;";
        break;
      case 38: // &
        escape = "&amp;";
        break;
      case 39: // '
        escape = "&#x27;";
        break;
      case 60: // <
        escape = "&lt;";
        break;
      case 62: // >
        escape = "&gt;";
        break;
      case 96: // `
        escape = "&#x60;";
        break;
      case 61: // =
        escape = "&#x3D;";
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      context.output += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    context.output += escape;
  }

  if (lastIndex !== index) {
    context.output += str.substring(lastIndex, index);
  }
}
