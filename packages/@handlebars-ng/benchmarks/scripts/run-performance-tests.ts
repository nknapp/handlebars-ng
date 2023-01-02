import { runAllTests } from "src/index";

const stats = await runAllTests();

console.dir(stats, { depth: 5 });
