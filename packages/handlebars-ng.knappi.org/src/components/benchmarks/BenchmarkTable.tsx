import type { Component } from "solid-js";
import parserBenchmarkTable from '@/__generated__/benchmarks/parser.json'
import runnerBenchmarkTable from '@/__generated__/benchmarks/runner.json'
import { BenchmarkGithubLink } from "./BenchmarkGithubLink";

const tables = {
  parser: parserBenchmarkTable,
  runner: runnerBenchmarkTable,
} as const;

export const BenchmarkTable: Component<{ tableName: keyof typeof tables }> = ({
  tableName,
}) => {
  const table = tables[tableName];
  if (table[0] == null) {
    throw new Error("Table has no header");
  }
  return (
    <table>
      <thead>
        <tr>
          {table[0].map((cell) => (
            <th>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.slice(1).map((row) => (
          <tr>
            <th><BenchmarkGithubLink filename={row[0] ?? ""} /></th>
            {row.slice(1).map((cell) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
