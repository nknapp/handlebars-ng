import { createLocalHbs4Executor } from "./createLocalHbs4Executor";
import { Executor } from "../common/Executor.types";
import Handlebars4xWorker from "./worker?worker";
import { wrap } from "comlink";

export const createHandlebars4xExecutor = import.meta.env["VITEST"]
  ? createLocalHbs4Executor
  : createWebWorkerExecutor;

export function createWebWorkerExecutor(): Executor {
  const worker = new Handlebars4xWorker();
  return wrap<Executor>(worker);
}
