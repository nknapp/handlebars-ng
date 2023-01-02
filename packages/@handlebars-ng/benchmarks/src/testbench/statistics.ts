import { Statistics } from "../types/types";

export function statistics(values: number[]): Statistics {
  const count = values.length;
  const average = sum(values) / count;
  const stdDev = computeStdDev(values, average);
  const sortedValues = [...values].sort((a, b) => a - b);
  return {
    count,
    average: average,
    stdDev: stdDev,
    min: percentile(sortedValues, 0),
    per25: percentile(sortedValues, 25),
    per50: percentile(sortedValues, 50),
    per75: percentile(sortedValues, 75),
    max: percentile(sortedValues, 100),
  };
}

function sum(values: Iterable<number>): number {
  let result = 0;
  for (const value of values) result += value;
  return result;
}

function computeStdDev(values: number[], average: number) {
  const n = values.length;
  const sumOfSquares = sum(squares(values, average));
  return Math.sqrt((1 / (n - 1)) * sumOfSquares);
}

function* squares(values: number[], average: number): Generator<number> {
  for (const value of values) {
    yield (value - average) * (value - average);
  }
}

function percentile(sortedValues: number[], percentile: number): number {
  const index = (percentile * sortedValues.length) / 100;
  const integerIndex = Math.min(Math.floor(index), sortedValues.length - 1);
  return sortedValues[integerIndex];
}
