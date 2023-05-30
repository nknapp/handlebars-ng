import "./defineGlobalObject";
import { createLocalHbs4Executor } from "./createLocalHbs4Executor";
import { expose } from "comlink";

const executor = createLocalHbs4Executor();
expose(executor);
