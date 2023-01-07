import { Program } from "types/ast";

const OTHERS_LEXICAL = Symbol("other properties (sorted lexically)");

// When this changes, it should also be change in the spec (01-introduction)
const propertyOrder: Array<typeof OTHERS_LEXICAL | string> = [
  "type",
  "value",
  "original",
  OTHERS_LEXICAL,
  "loc",
  // used inside "loc"
  "start",
  "end",
  "source",
  // used inside "loc.start" and "loc.end"
  "line",
  "column",
  // used inside "trim"
  "open",
  "close",
];

export function enforcePropertyOrder(ast: Program): Program {
  return deepSortProperties(ast, byPropertyOrder);
}

type CompareFn<T> = (a: T, b: T) => number;

function deepSortProperties(
  ast: Program,
  compareFn: CompareFn<string>
): Program {
  return JSON.parse(JSON.stringify(ast), (key: string, value: unknown) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "object" && value != null) {
      return sortProperties(value, compareFn);
    }
    return value;
  });
}

function sortProperties(object: object, compareFn: CompareFn<string>) {
  const entries = Object.entries(object);
  entries.sort((a, b) => compareFn(a[0], b[0]));
  return Object.fromEntries(entries);
}

const orderLookup = new Map(propertyOrder.map((prop, index) => [prop, index]));

function byPropertyOrder(propA: string, propB: string): number {
  const orderA = orderLookup.get(propA) ?? orderLookup.get(OTHERS_LEXICAL) ?? 0;
  const orderB = orderLookup.get(propB) ?? orderLookup.get(OTHERS_LEXICAL) ?? 0;
  if (orderA < orderB) return -1;
  if (orderA > orderB) return 1;
  if (propA < propB) return -1;
  if (propA > propB) return 1;
  return 0;
}
