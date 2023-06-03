import json5 from "json5";

describe("json5", () => {
  it("does not put quotes around keys", () => {
    expect(json5.stringify({ abc: "cde" })).toEqual("{abc:'cde'}");
  });
});
