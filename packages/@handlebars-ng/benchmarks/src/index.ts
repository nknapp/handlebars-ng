import {
  FunctionBenchmark,
  FunctionUnderTest,
} from "./testbench/FunctionBenchmark";
import { parse } from "@handlebars-ng/parser";
import Handlebars from "handlebars";

function originalHandlebars() {
  Handlebars.parse("this is {{a}} {{test}}");
}

function handlebarsNg() {
  parse("this is {{a}} {{test}}");
}

await runWith(originalHandlebars);
await runWith(handlebarsNg);

async function runWith(fn: FunctionUnderTest): Promise<void> {
  const bench = new FunctionBenchmark(fn);
  await bench.run(10000);
  // eslint-disable-next-line no-console
  console.log(fn.name, bench.getStats());
}
