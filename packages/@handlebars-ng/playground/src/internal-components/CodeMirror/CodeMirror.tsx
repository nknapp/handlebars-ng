import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/handlebars/handlebars";
import "codemirror/mode/xml/xml";
import { Component, createEffect, createSignal } from "solid-js";
import { CodeMirrorProps } from "./CodeMirror.types";
import { onCleanup } from "solid-js";
import { createCodeMirror } from "./createCodeMirror";

const CodeMirror: Component<CodeMirrorProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLElement | null>(null);
  // textarea must be writable, but eslint does not recognize this
  // eslint-disable-next-line prefer-const
  const [textarea, setTextArea] = createSignal<HTMLTextAreaElement | null>(
    null
  );

  const editor = createCodeMirror(textarea, () => props.language);

  createEffect(() => {
    const containerElement = container();
    const editorInstance = editor();
    if (containerElement == null) return;
    if (editorInstance == null) return;
    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = containerElement.getBoundingClientRect();
      editorInstance.setSize(width, height);
    });
    resizeObserver.observe(containerElement);
    onCleanup(() => resizeObserver.disconnect());
  });

  return (
    <div class={"h-full"} ref={setContainer}>
      <textarea
        id={props.id}
        class="hidden"
        ref={setTextArea}
        readOnly={props.readonly}
        onInput={(event) => props.onInput?.(event.target.value)}
      >
        {props.value}
      </textarea>
    </div>
  );
};

export default CodeMirror;
