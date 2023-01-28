import { handlebarsSpec } from "./";
import exampleSpec from "./spec/01-introduction/example.hb-spec.json";

describe("spec", () => {
  it("contains the example spec", () => {
    expect(Object.keys(handlebarsSpec)).toContain(
      "01-introduction/example.hb-spec.json"
    );
  });
  it("has the correct spec", () => {
    expect(handlebarsSpec["01-introduction/example.hb-spec.json"]).toEqual(
      exampleSpec
    );
  });
});
