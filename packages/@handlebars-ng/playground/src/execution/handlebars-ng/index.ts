import { createLocalHbsNgExecutor } from "./createLocalHbsNgExecutor";
import { Executor } from "../common/Executor.types";
import HandlebarsNgWorker from "./worker?worker";
import { wrap } from "comlink";

export const createHandlebarsNgExecutor = import.meta.env["VITEST"]
  ? createLocalHbsNgExecutor
  : createWebWorkerExecutor;

export function createWebWorkerExecutor(): Executor {
  const worker = new HandlebarsNgWorker();
  return wrap<Executor>(worker);
}
