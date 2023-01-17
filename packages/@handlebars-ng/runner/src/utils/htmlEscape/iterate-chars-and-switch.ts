export function escapeHtmlIterateSwitchPlusEquals(string: string): string {
  let result = "";
  for (let i = 0; i < string.length; i++) {
    switch (string.charAt(i)) {
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
        result += string.charAt(i);
    }
  }
  return result;
}
