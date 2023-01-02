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

export interface Measurement {
  count: number;
  average: number;
}

export interface NamedMeaseurement extends Measurement {
  test: string;
  objectUnderTest: string;
}

export interface TestResult {
  name: string;
  originalParser: Measurement;
  originalRunner: Measurement;
  nextGeneParser: Measurement;
  nextGeneRunner: Measurement;
}
