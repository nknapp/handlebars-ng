export function mapKeys<Input extends string, Output extends string, Value>(
  object: Record<Input, Value>,
  fn: (key: Input) => Output
): Record<Output, Value> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [fn(key as Input), value])
  ) as Record<Output, Value>;
}
