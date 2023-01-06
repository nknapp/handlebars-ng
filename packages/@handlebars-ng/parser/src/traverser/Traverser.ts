import { AnyNode, Program } from "@handlebars-ng/specification/ast";

export interface ArrayContext {
  type: "array";
  array: AnyNode[];
}

export interface ObjectKeyContext {
  type: "objectKey";
  node: AnyNode;
  parent: AnyNode;
  key: string;
}

export interface ArrayItemContext {
  type: "arrayItem";
  node: AnyNode;
  array: AnyNode[];
  index: number;
}

export type TraverseContext =
  | ArrayContext
  | ObjectKeyContext
  | ArrayItemContext;

export class Traverser {
  *traverse(program: Program): Generator<TraverseContext> {
    yield {
      type: "array",
      array: program.body,
    };
  }
}
