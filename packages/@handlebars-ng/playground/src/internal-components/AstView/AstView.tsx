import { Program } from "@handlebars-ng/abstract-syntax-tree";
import { Component, createEffect, createResource } from "solid-js";
import { formatAst } from "./formatAst";
import { CodeEditor } from "../CodeEditor";

interface AstViewProps {
  ast?: Program;
  label: string;
  loading: boolean;
}

export const AstView: Component<AstViewProps> = (props) => {
  const prettifyAst = async () => {
    return props.ast ? await formatAst(props.ast) : "";
  };
  const [prettyAst, { refetch: reloadAst }] = createResource(prettifyAst, {});

  createEffect(() => {
    if (props.ast != null) reloadAst();
  });

  return (
    <CodeEditor
      label={props.label}
      value={prettyAst.state === "ready" ? prettyAst() : ""}
      overlayText={
        props.loading || prettyAst.loading ? "Loading..." : undefined
      }
      readonly
      language="json"
    />
  );
};
