export function extractMiddle(string: string, prefix: string, suffix: string) {
  if (!string.startsWith(prefix))
    throw new Error(`Expected string to start with "${prefix}".`);
  if (!string.endsWith(suffix))
    throw new Error(`Expected string to start with "${suffix}".`);
  return string.slice(prefix.length, -suffix.length);
}
