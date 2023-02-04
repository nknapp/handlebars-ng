export function getOwnProperty(value: unknown, property: string): unknown {
  const object = value as Record<string, unknown>;
  if (!Object.hasOwn(object, property)) return null;
  return object[property] ?? null;
}
