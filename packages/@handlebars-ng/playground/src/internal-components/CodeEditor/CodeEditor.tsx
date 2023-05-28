import type { Component } from "solid-js";
import { createUniqueId } from "solid-js";
import { CodeMirror } from "../CodeMirror";
import { CodeEditorProps } from "./CodeEditor.types";

export const CodeEditor: Component<CodeEditorProps> = ({
  label,
  value,
  language,
  onInput,
}) => {
  const id = createUniqueId();

  return (
    <div class={"border border-orange-200 rounded bg-white h-64 relative"}>
      <div class={"border-b border-orange-200 bg-gray-50 h-8 ps-2 flex items-center"}>
        <label for={id}>{label}</label>
      </div>
      <div class={"absolute inset-2 mt-1 top-8"}>
        <CodeMirror
          id={id}
          value={value}
          onInput={onInput}
          language={language}
        />
      </div>
    </div>
  );
};
