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
  readonly = false,
}) => {
  // textarea must be writable, but eslint does not recognize this
  // eslint-disable-next-line prefer-const
  let textarea: HTMLTextAreaElement | undefined = undefined;
  // Container must be writable, but eslint does not recognize this
  // eslint-disable-next-line prefer-const
  let container: HTMLElement | undefined = undefined;
  let editor: CodeMirrorFactory.EditorFromTextArea | null = null;

  onMount(async () => {
    if (textarea == null || container == null) {
      throw new Error(
        "Cannot inject CodeMirror, container or textarea is null!"
      );
    }

    const bounds = await waitForBounds(container);
    editor = CodeMirrorFactory.fromTextArea(textarea, {
      value,
      mode: codeMirrorMode(language),
      readOnly: readonly,
    });
    editor.setSize(bounds.width, bounds.height);
    editor.on("change", () => {
      if (editor == null) return;
      onInput?.(editor.getValue());
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

async function waitForBounds(container: HTMLElement): Promise<DOMRect> {
  for (let i = 0; i < 10; i++) {
    const bounds = container.getBoundingClientRect();
    if (bounds.width > 0 && bounds.height > 0) {
      return bounds;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("CodeMirror container has size 0");
}

export default CodeMirror;
