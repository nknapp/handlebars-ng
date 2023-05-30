import { createLocalHbsNgExecutor } from "./createLocalHbsNgExecutor";
import { expose } from "comlink";

const executor = createLocalHbsNgExecutor();
expose(executor);
