import { tests } from ".";

describe("tests", () => {
  it("contains", () => {
    expect(tests).toContainEqual({
      name: "mustaches.perf.ts",
      template: expect.stringContaining("Lorem ipsum"),
      input: {
        a1: "Nils Knappmeier",
        a2: "Test2",
        a3: "Test3",
        a4: "Test4",
        a5: "Test5",
      },
    });
  });
});
