import { Executor } from "../common/Executor.types";
import { wrap } from "comlink";
import Handlebars4xWorker from "./worker?worker&inline";

export function createWebWorkerHandlebars4xExecutor(): Executor {
  const worker = new Handlebars4xWorker();
  return wrap<Executor>(worker);
}
