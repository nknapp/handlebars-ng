import { render, screen } from "@solidjs/testing-library";
import { CodeEditor } from "./CodeEditor";
import type { CodeEditorProps } from "./CodeEditor.types";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { captureUncaughtErrors } from "../../test-utils/captureUncaughtErrors";

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

  it("calls onInput when content changes", async () => {
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

  it("ignores input when no onInput is provided", async () => {
    const user = userEvent.setup();
    await renderCodeEditor({
      label: "label",
      value: "value",
    });
    const editor = await screen.findByLabelText("label");
    expect(editor).toHaveValue("value");

    const uncaughtErrors = await captureUncaughtErrors(async () => {
      await user.click(editor);
      await user.clear(editor);
    });
    expect(uncaughtErrors).toHaveLength(0);
  });

  it("renders a readonly editor when set to 'readonly'", async () => {
    await renderCodeEditor({
      label: "label",
      value: "value",
      readonly: true,
    });
    const editor = await screen.findByLabelText("label");
    expect(editor).toHaveAttribute("readonly");
  });

  it("renders overlay when specified", async () => {
    await renderCodeEditor({
      label: "label",
      value: "value",
      overlayText: "overlay text",
      readonly: true,
    });
    expect(screen.queryByText("overlay text")).not.toBeNull();
  });
});
