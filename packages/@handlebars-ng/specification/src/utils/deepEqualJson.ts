import { isDeepStrictEqual } from "node:util";

/**
 * isDeepStrictEqual does not work properly for ASTs because the prototypes are different.
 * we convert to a plain object but parsing the stringified version.
 */
export function deepEqualJson(obj1: unknown, obj2: unknown): boolean {
  const plainObj1 = JSON.parse(JSON.stringify(obj1));
  const plainObj2 = JSON.parse(JSON.stringify(obj2));

  return isDeepStrictEqual(plainObj1, plainObj2);
}
