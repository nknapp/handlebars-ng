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

export interface Statistics {
  count: number;
  average: number;
  stdDev: number;
  min: number;
  per25: number;
  per50: number;
  per75: number;
  max: number;
}

export interface Diagnosis {
  sum: number;
  total: number;
  overheadPercent: number;
}

export interface Measurement {
  statistics: Statistics;
  diagnosis: Diagnosis;
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
