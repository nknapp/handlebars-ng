import {test} from "vitest";

function *generate(): Generator<number> {
    for (let i=0; i<10; i++) {
        yield i
    }
}

test("gen", () => {
    let numbers = generate();
    for (const num of numbers) {
        console.log("x")
        console.log(num)
        console.log("x", numbers[Symbol.iterator]().next())
    }
})