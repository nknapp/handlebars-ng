const illegalChars = /[&<>"'`=]/;

//  This function is the result of performance measurements https://github.com/nknapp/html-escape-benchmarks.
//  This is not the fastest function in all cases, but if if reasonable fast for short strings and faster than
//  other solutions for longer strings
export function htmlEscape(string: string): string {
  // For short strings, it is faster to check for the existance of
  // chars with a regex before replacing.
  if (string.length < 20 && !illegalChars.test(string)) {
    return string;
  }
  return string
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("`", "&#x60;")
    .replaceAll("=", "&#x3D;");
}
