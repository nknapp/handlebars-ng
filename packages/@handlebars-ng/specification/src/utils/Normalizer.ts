import Handlebars from "handlebars";
import { combineContentStatements } from "./combineContentStatements";

export class Normalizer extends Handlebars.Visitor {
  override acceptArray(arr: hbs.AST.Node[]): void {
    combineContentStatements(arr);
  }
}
