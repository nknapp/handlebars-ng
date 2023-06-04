import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import CodeMirrorFactory from "codemirror";
import { codeMirrorMode } from "./codeMirrorMode";
import { EditorLanguage } from "dist/internal-components/CodeMirror";

export function createCodeMirror(
  textArea: Accessor<HTMLTextAreaElement | null>,
  language: Accessor<EditorLanguage | undefined>
) {
  const [editor, setEditor] =
    createSignal<CodeMirrorFactory.EditorFromTextArea | null>(null);

  createEffect(() => {
    const textAreaElement = textArea();
    if (textAreaElement == null) {
      throw new Error(
        "Cannot inject CodeMirror, container or textarea is null!"
      );
    }

    // const bounds = await waitForBounds(container);
    const editor = CodeMirrorFactory.fromTextArea(textAreaElement, {
      mode: codeMirrorMode(language()),
      value: textAreaElement.value,
      readOnly: textAreaElement.readOnly,
    });
    editor.on("change", () => {
      textAreaElement.value = editor.getValue();
      textAreaElement.dispatchEvent(new InputEvent("input", { bubbles: true }));
    });

    onCleanup(() => {
      editor?.toTextArea();
    });
    setEditor(editor);
  });

  return editor;
}
