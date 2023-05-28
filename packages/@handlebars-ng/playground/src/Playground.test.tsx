import { render, screen } from "@solidjs/testing-library";
import {Playground} from "./Playground";

const initialValues = {
  template: "{{firstname}} {{loud lastname}}",
  setupScript: `Handlebars.registerHelper('loud', (aString) => {
    return aString.toUpperCase()
})
`,
  input: `{ firstname: "Yehuda", lastname: "Katz" }\n`,
};

describe("Playground", () => {
  it("renders an template input", async () => {
    render(() => <Playground/>);
    expect(await screen.findByLabelText("Template")).toHaveValue(initialValues.template)
  });
  it("renders an setup script input", async () => {
    render(() => <Playground/>);
    expect(await screen.findByLabelText("Setup script")).toHaveValue(initialValues.setupScript);
  });
  it("renders an input-data input", async () => {
    render(() => <Playground/>);
    expect(await screen.findByLabelText("Input")).toHaveValue(initialValues.input)
  });
});
