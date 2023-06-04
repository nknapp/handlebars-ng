import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { Component, createMemo } from "solid-js";
import { formatAst } from "./formatAst";
import { CodeEditor } from "../CodeEditor";

interface AstViewProps {
  ast: Program;
  label: string;
}

export const AstView: Component<AstViewProps> = (props) => {
  const prettyAst = createMemo(() => formatAst(props.ast));
  return (
    <CodeEditor
      label={props.label}
      value={prettyAst()}
      readonly
      language="json"
    />
  );
};
