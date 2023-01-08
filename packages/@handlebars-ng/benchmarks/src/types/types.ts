export interface PerformanceTest {
  template: string;
  input: Record<string, unknown>;
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
