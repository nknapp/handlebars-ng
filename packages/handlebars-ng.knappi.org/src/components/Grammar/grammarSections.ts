const regex = /@section:(.*)/g;

export function grammarSections(grammar: string, section: string): string {
  regex.lastIndex = 0;

  const start = grammar.indexOf(`@section:${section}`);
  const lineAfterStart = grammar.indexOf("\n", start);
  const end = grammar.indexOf(`@section`, lineAfterStart);
  if (end === -1) {
    return grammar.slice(lineAfterStart);
  }
  const lineBeforeEnd = grammar.lastIndexOf("\n", end);

  return grammar.slice(lineAfterStart, lineBeforeEnd);
}
