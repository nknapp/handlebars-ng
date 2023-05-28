import { render, screen } from "@solidjs/testing-library";
import { CodeEditor } from "./CodeEditor";
import type { CodeEditorProps } from "./CodeEditor.types";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("./CodeMirror");

function renderCodeEditor(props: CodeEditorProps) {
  render(() => <CodeEditor {...props} />);
}

describe("CodeEditor", () => {
  it("shows label and value", async () => {
    await renderCodeEditor({
      label: "label",
      value: "value",
      onInput: vi.fn(),
    });
    expect(await screen.findByLabelText("label")).toHaveValue("value");
  });

  it("calls onChange when content changes", async () => {
    const user = userEvent.setup();
    const onInput = vi.fn();
    await renderCodeEditor({
      label: "label",
      value: "value",
      onInput,
    });
    const editor = await screen.findByLabelText("label");
    expect(editor).toHaveValue("value");
    await user.click(editor);
    await user.clear(editor);
    await user.keyboard("abc");
    expect(onInput).toHaveBeenCalledWith("abc");
  });
});
