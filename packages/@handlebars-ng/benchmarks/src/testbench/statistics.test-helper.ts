export function expectValueWithThreshold(
  actual: number,
  expected: number,
  threshold: number
) {
  expect(actual).toBeLessThanOrEqual(expected + threshold);
  expect(actual).toBeGreaterThanOrEqual(expected - threshold);
}
