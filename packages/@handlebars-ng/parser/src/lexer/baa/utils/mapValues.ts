export function mapValues<K extends string, In, Out>(
  input: Record<K, In>,
  mapFn: (v: In) => Out
): Record<K, Out> {
  return Object.fromEntries(
    Object.entries<In>(input).map((entry) => [entry[0], mapFn(entry[1])])
  ) as Record<K, Out>;
}
