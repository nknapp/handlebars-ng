import type { Program } from "@handlebars-ng/abstract-syntax-tree";
import { CleanupVisitor } from "./CleanupVisitor";
import { ContentCombiningVisitor } from "./ContentCombiningVisitor";
import { enforcePropertyOrder } from "./enforcePropertyOrder";

/**
 * Bring an AST into canonical form
 *
 * * Make sure properties are sorted in a canonical way.
 * * Combine multiple consecutive content-nodes into one.
 */
export function normalizeAst(ast: Program): Program {
  let copy = JSON.parse(JSON.stringify(ast));
  new ContentCombiningVisitor().accept(copy);
  new CleanupVisitor().accept(copy);
  copy = enforcePropertyOrder(copy);
  return copy;
}
