import { clamp } from "@/utils/clamp";

describe("clamp", () => {
  it("returns the wanted value if within range", () => {
    expect(clamp(0, 5, 10)).toEqual(5);
  });

  it("returns the min value if wanted is smaller", () => {
    expect(clamp(0, -5, 10)).toEqual(0);
  });
  it("returns the max value if wanted is larger", () => {
    expect(clamp(0, 15, 10)).toEqual(10);
  });
});
