export function mapValues<K extends string, In, Out>(
  input: Record<K, In>,
  mapFn: (v: In, key: K) => Out
): Record<K, Out> {
  return Object.fromEntries(
    Object.entries<In>(input).map((entry) => [
      entry[0],
      mapFn(entry[1], entry[0] as K),
    ])
  ) as Record<K, Out>;
}
