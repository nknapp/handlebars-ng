import { ContentCombiningVisitor } from "./ContentCombiningVisitor";

/**
 * Bring an AST into canonical form
 *
 * * Make sure properties are sorted in a canonical way.
 * * Combine multiple consecutive content-nodes into one.
 */
export function normalizeAst(ast: hbs.AST.Program): hbs.AST.Program {
  let copy = JSON.parse(JSON.stringify(ast));
  new ContentCombiningVisitor().accept(copy);
  copy = sortProps(copy);
  return copy;
}

function sortProps(ast: hbs.AST.Program): hbs.AST.Program {
  return JSON.parse(JSON.stringify(ast), propertySortingReviver);
}

function propertySortingReviver(key: string, value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && value != null) {
    const sortedEntries = Object.entries(value).sort(
      byFirstItemWith(propertyComparator)
    );
    return Object.fromEntries(sortedEntries);
  }
  return value;
}

type CompareFn<T> = (a: T, b: T) => number;

function byFirstItemWith<T extends unknown[]>(
  compareFn: CompareFn<T[0]>
): CompareFn<T> {
  return (a, b) => compareFn(a[0], b[0]);
}

const OTHER = Symbol("other properties");
const propertyOrder: Array<typeof OTHER | string> = [
  "type",
  "value",
  "original",
  OTHER,
  "loc",
  "line",
  "column",
  "start",
  "end",
];
const orderLookup = new Map(propertyOrder.map((prop, index) => [prop, index]));

function propertyComparator(propA: string, propB: string): number {
  const orderA = orderLookup.get(propA) ?? orderLookup.get(OTHER) ?? 0;
  const orderB = orderLookup.get(propB) ?? orderLookup.get(OTHER) ?? 0;
  if (orderA < orderB) return -1;
  if (orderA > orderB) return 1;
  if (propA < propB) return -1;
  if (propA > propB) return 1;
  return 0;
}
