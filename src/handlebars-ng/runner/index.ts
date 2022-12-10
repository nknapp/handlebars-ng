import {AnyNode, ContentStatement, Program} from "../parser/types/ast/program";


type CompiledTemplate = (input: unknown) => string;

export function compile(ast: Program): CompiledTemplate {
    return (input) => {
        return new RunnerVisitor(ast).run(input)
    }
}


export class Visitor {
    visitNode(node: AnyNode): void {
        switch (node.type) {
            case "ContentStatement":
                return this.visitContentStatement(node)
            case "Program":
                return this.visitProgram(node)
            default:
                // @ts-ignore
                throw new Error("Unknown node type: " + node.type)
        }
    }

    visitProgram(node: Program) {
    }

    visitContentStatement(node: ContentStatement): void {
    }
}

export class RunnerVisitor extends Visitor {
    private output: string[]
    private readonly ast: Program;

    constructor(ast: Program) {
        super();
        this.ast = ast
        this.output = []
    }

    run(input: any): string {
        this.visitNode(this.ast)
        return this.output.join("")
    }

    visitProgram(node: Program) {
        for (const bodyPart of node.body) {
            this.visitNode(bodyPart)
        }
    }


    visitContentStatement(node: ContentStatement) {
        this.output.push(node.value)
    }
}