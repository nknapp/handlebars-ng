import {
  ContentStatement,
  MustacheStatement,
  PathExpression,
  Program,
  Statement,
} from "../model/ast";
import { TokenStream } from "./TokenStream";

export interface ParserContext {
  readonly tokens: TokenStream;

  program(context: ParserContext): Program;
  statement(context: ParserContext): Statement;
  content(context: ParserContext): ContentStatement;
  mustache(context: ParserContext): MustacheStatement;
  tripleMustache(context: ParserContext): MustacheStatement;
  pathExpression(context: ParserContext): PathExpression;
}
