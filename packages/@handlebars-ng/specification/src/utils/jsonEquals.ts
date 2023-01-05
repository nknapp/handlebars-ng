/**
 * isDeepStrictEqual does not work properly for ASTs because the prototypes are different.
 * we convert to a plain object but parsing the stringified version.
 */
export function jsonEquals(obj1: unknown, obj2: unknown): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
