import type { Component } from "solid-js";
import { BenchmarkGithubLink } from "./BenchmarkGithubLink";

export const BenchmarkTable: Component<{ table: string[][] }> = ({ table }) => {
  if (table[0] == null) {
    throw new Error("Table has no header");
  }
  return (
    <table class="w-full">
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
            <th>
              <BenchmarkGithubLink filename={row[0] ?? ""} />
            </th>
            {row.slice(1).map((cell) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
