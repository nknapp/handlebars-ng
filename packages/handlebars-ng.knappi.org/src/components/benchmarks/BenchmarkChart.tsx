/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, onMount } from "solid-js";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Colors,
  Legend,
} from "chart.js";
import type { GraphData } from "@handlebars-ng/benchmarks/dist/types/types";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Colors,
  Legend
);

export const BenchmarkChart: Component<{
  benchmarkResults: GraphData;
}> = ({ benchmarkResults }) => {
  let element: HTMLCanvasElement | undefined;

  onMount(() => {
    if (element == null) return;
    new Chart(element, {
      type: "bar",

      data: {
        labels: benchmarkResults.tests,
        datasets: benchmarkResults.datasets
      },
      plugins: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        legend: { position: "top" },
      },
      options: {
        animation: {
            duration:0 
        },
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });

  return (
    <div class="w-full">
      <canvas ref={element!} />
    </div>
  );
};
