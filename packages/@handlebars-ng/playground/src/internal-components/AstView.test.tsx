import { render } from "@solidjs/testing-library";
import { AstView } from "./AstView";

describe("AstView", () => {
  it("renders", () => {
    render(() => <AstView />);
  });
});
