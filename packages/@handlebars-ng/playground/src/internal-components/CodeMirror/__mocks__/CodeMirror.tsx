import type { Component } from "solid-js";
import type { CodeMirrorProps } from "../CodeMirror.types";

const CodeMirror: Component<CodeMirrorProps> = (props) => {
  return (
    <textarea
      id={props.id}
      value={props.value}
      onInput={(event) => props.onInput?.(event.target.value)}
      data-language={props.language}
      readOnly={props.readonly}
    />
  );
};

export default CodeMirror;
