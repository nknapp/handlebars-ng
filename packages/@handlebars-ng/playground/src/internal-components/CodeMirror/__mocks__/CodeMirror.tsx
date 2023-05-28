import type { Component } from "solid-js";
import type { CodeMirrorProps } from "../CodeMirror.types";

const CodeMirror: Component<CodeMirrorProps> = ({
  id,
  language,
  value,
  onInput,
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onInput={(event) => onInput(event.target.value)}
      data-language={language}
    />
  );
};

export default CodeMirror;
