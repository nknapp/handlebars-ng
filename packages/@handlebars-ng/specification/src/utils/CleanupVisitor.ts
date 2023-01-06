/* eslint-disable @typescript-eslint/ban-ts-comment */
import Handlebars from "handlebars";

export class CleanupVisitor extends Handlebars.Visitor {
  ContentStatement(content: hbs.AST.ContentStatement): void {
    // Left-stripped and right-stripped are inserted by Handlebars, but they are not official.
    // They are just used internally to implement white-space control and then left in the AST
    // @ts-ignore
    delete content.leftStripped;
    // @ts-ignore
    delete content.rightStripped;
  }
}
