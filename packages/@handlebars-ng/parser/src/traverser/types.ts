import {
  Program,
  ContentStatement,
  MustacheStatement,
} from "@handlebars-ng/specification/ast";

export interface Handlers {
  Program: Handler<Program>;
  ContentStatement: Handler<ContentStatement>;
  MustacheStatement: Handler<MustacheStatement>;
}

type Handler<T> = (node: T) => void;

export type NodeType = keyof Handlers;
