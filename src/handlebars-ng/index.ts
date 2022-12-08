import {parse} from "./parser";
import {compile} from "./runner";

export const Handlebars = {
    create() {
        return this
    },
    parse: parse,
    compile: compile
}