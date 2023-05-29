import { render, screen } from "@solidjs/testing-library";
import { Playground } from "./Playground";

const initialValues = {
  template: "{{firstname}} {{loud lastname}}",
};

describe("Playground", () => {
  it("renders an template input", async () => {
    render(() => <Playground />);
    expect(await screen.findByLabelText("Template")).toHaveValue(
      initialValues.template
    );
  });
});
