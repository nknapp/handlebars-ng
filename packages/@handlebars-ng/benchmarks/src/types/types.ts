export interface PerformanceTest {
  template: string;
  input: Record<string, unknown>;
}

export interface NamedPerformanceTest extends PerformanceTest {
  name: string;
}

export interface ObjectUnderTest {
  name: string;
  createRunner: (test: PerformanceTest) => Runner;
}

export interface Runner {
  run(): Promise<void> | void;
}

export interface GraphData {
  datasets: GraphDataSet[];
  tests: string[];
}

export interface GraphDataSet {
  label: string;
  data: Array<[min: number, max: number]>;
}
