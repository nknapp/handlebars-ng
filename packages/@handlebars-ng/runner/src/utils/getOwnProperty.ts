export function getOwnProperty(value: unknown, property: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(value, property)) return null;
  const object = value as Record<string, unknown>;
  return object[property] ?? null;
}
