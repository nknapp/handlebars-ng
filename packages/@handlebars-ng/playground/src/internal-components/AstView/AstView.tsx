import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { Component } from "solid-js";
import { formatAst } from "./formatAst";
import { CodeEditor } from "../CodeEditor";

interface AstViewProps {
  ast: Program;
  label: string;
}

export const AstView: Component<AstViewProps> = ({ label, ast }) => {
  const prettyAst = formatAst(ast);
  return <CodeEditor label={label} value={prettyAst} language="json" />;
};
