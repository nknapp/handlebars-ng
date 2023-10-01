import { render, screen, waitFor } from "@solidjs/testing-library";
import { Playground } from "./Playground";

const initialValues = {
  template: "{{firstname}} {{loud lastname}}",
};

describe("Playground", () => {
  it("renders an template input", async () => {
    render(() => <Playground />);
    expect(await screen.findByLabelText("Template")).toHaveValue(
      initialValues.template,
    );
  });

  it("renders the generated AST", async () => {
    render(() => <Playground />);
    const astElement = await screen.findByLabelText<HTMLTextAreaElement>("AST");
    await waitFor(() => {
      expect(astElement.value).toContain("firstname");
    });
  });
});
