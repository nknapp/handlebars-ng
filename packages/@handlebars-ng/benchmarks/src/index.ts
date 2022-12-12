import {
  FunctionBenchmark,
  FunctionUnderTest,
} from "./testbench/FunctionBenchmark";
import { parse } from "@handlebars-ng/parser";
import Handlebars from "handlebars";

const template = `this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
this is {{a}} {{test}}  this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}} this is {{a}} {{test}}
`;

function originalHandlebars() {
  Handlebars.parse(template);
}

function handlebarsNg() {
  parse(template);
}

await runWith(originalHandlebars);
await runWith(handlebarsNg);

async function runWith(fn: FunctionUnderTest): Promise<void> {
  const bench = new FunctionBenchmark(fn);
  await bench.run(1000);
  // eslint-disable-next-line no-console
  console.log(fn.name, bench.getStats());
}
