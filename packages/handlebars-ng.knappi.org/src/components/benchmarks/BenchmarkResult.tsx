import type { Component } from "solid-js";
import parserBenchmark from '@/__generated__/benchmarks/parser.json'
import runnerBenchmark from '@/__generated__/benchmarks/runner.json'
import { BenchmarkChart } from "./BenchmarkChart";
import type { GraphData } from "@handlebars-ng/benchmarks/dist/types/types";
import { BenchmarkTable } from "./BenchmarkTable";

const benchmarks = {
  parser: parserBenchmark,
  runner: runnerBenchmark,
} as const;


export const BenchmarkResult: Component<{name: keyof typeof benchmarks}> = ({name}) => {
    const result = benchmarks[name]

    return <div>
        <BenchmarkTable table={result.table as string[][]} />
        <BenchmarkChart benchmarkResults={result.graph as GraphData} />
    </div>
}