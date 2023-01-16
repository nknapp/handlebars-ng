// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HelperFn = (...args: never[]) => string;

export interface PerformanceTest {
  template: string;
  input: Record<string, unknown>;
  helpers?: Record<string, HelperFn>;
}

export interface NamedPerformanceTest extends PerformanceTest {
  name: string;
}

export interface ObjectUnderTest {
  name: string;
  testFn: (test: PerformanceTest) => () => void;
}

export interface GraphData {
  unit: string;
  datasets: GraphDataSet[];
  tests: string[];
}

export interface GraphDataSet {
  label: string;
  data: Array<[min: number, max: number]>;
}
