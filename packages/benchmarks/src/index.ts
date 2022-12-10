import {FunctionBenchmark, FunctionUnderTest} from "./testbench/FunctionBenchmark";

const uintArrayUnderTest = new Uint8Array(100000)
const stringUnderTest = "1234567890".repeat(10000)

function typedArray() {
    let lastValue = 0;
    for (const x of uintArrayUnderTest) {
        lastValue = x
    }
    return lastValue
}

function string() {
    let lastValue = "";
    for (const x of stringUnderTest) {
        lastValue = x
    }
    return lastValue
}

await runWith(typedArray)
await runWith(string)

async function runWith(fn: FunctionUnderTest): Promise<void> {
    const bench = new FunctionBenchmark(fn)
    await bench.run(1000);
    console.log(fn.name, bench.getStats())
}


