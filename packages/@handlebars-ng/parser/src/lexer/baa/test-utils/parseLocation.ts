export function parseLocation(location: string): {
  line: number;
  column: number;
} {
  const [line, column] = location.split(":").map(Number);
  return { line, column };
}
