import { createLocalHbs4Executor } from "./createLocalHbs4Executor";
import { createWebWorkerHandlebars4xExecutor } from "./createWebWorkerHandlebars4xExecutor";

export const createHandlebars4xExecutor = import.meta.env["VITEST"]
  ? createLocalHbs4Executor
  : createWebWorkerHandlebars4xExecutor;
