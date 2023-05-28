import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/handlebars/handlebars";
import "codemirror/mode/xml/xml";
import type { Component } from "solid-js";
import { codeMirrorMode } from "./codeMirrorMode";

import CodeMirrorFactory from "codemirror";
import { CodeMirrorProps } from "./CodeMirror.types";
import { onCleanup, onMount } from "solid-js";

const CodeMirror: Component<CodeMirrorProps> = ({
  id,
  value,
  language,
  onInput,
}) => {
  // textarea must be writable, but eslint does not recognize this
  // eslint-disable-next-line prefer-const
  let textarea: HTMLTextAreaElement | undefined = undefined;
  // Container must be writable, but eslint does not recognize this
  // eslint-disable-next-line prefer-const
  let container: HTMLElement | undefined = undefined;
  let editor: CodeMirrorFactory.EditorFromTextArea | null = null;

  onMount(() => {
    if (textarea == null || container == null) {
      throw new Error(
        "Cannot inject CodeMirror, container or textarea is null!"
      );
    }
    const bounds = container.getBoundingClientRect();
    editor = CodeMirrorFactory.fromTextArea(textarea, {
      value,
      mode: codeMirrorMode(language),
    });
    editor.setSize(bounds.width, bounds.height);
    editor.on("change", () => {
      if (editor == null) return;
      onInput(editor.getValue());
    });
  });

  onCleanup(() => {
    editor?.toTextArea();
  });

  return (
    <div class={"h-full"} ref={container}>
      <textarea id={id} class="hidden" ref={textarea}>
        {value}
      </textarea>
    </div>
  );
};

export default CodeMirror;
