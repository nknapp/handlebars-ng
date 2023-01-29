import { extractMiddle } from "./strings";

describe("strings", () => {
  describe("extractMiddle", () => {
    it("throws an error if the prefix does not match", () => {
      expect(() => extractMiddle("abc", "(", ")")).toThrow();
    });
    it("throws an error if the suffix does not match", () => {
      expect(() => extractMiddle("(bc", "(", ")")).toThrow();
    });
  });
  it("returns the part between prefix and suffix", () => {
    expect(extractMiddle("(b)", "(", ")")).toEqual("b");
  });
});
