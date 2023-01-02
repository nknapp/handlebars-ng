import { statistics } from "./statistics";

describe("statistics", () => {
  it("computes count", () => {
    const result = statistics([1, 3, 5]);
    expect(result.count).toEqual(3);
  });
  it("computes average", () => {
    expect(statistics([1, 3, 5]).average).toEqual(3);
    expect(statistics([1, 3]).average).toEqual(2);
    expect(statistics([5, 5]).average).toEqual(5);
  });

  it("computes std-deviation", () => {
    expect(statistics([1, 3, 5]).stdDev).toEqual(2);
    expect(statistics([2, 3, 4]).stdDev).toEqual(1);
    expect(statistics([5, 5]).stdDev).toEqual(0);
  });

  it("computes quarter percentiles", () => {
    const stats = statistics([5, 40, 300, 2000, 10000]);
    expect(stats.min).toEqual(5);
    expect(stats.per25).toEqual(40);
    expect(stats.per50).toEqual(300);
    expect(stats.per75).toEqual(2000);
    expect(stats.max).toEqual(10000);
  });
});
