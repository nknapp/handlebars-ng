export interface HandlebarsTest {
    filename: string,
    description: string
    template: string
    ast: object,
    input: object,
    helpers?: Record<string, string>
    output: string

}

export const testCases: HandlebarsTest[] = [{"description":"A simple text is output as is\n","template":"This is a simple text","ast":{"type":"Program","body":[{"type":"ContentStatement","original":"This is a simple text","value":"This is a simple text","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":21}}}],"strip":{},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":21}}},"input":{},"output":"This is a simple text","filename":"basic/just-text.hb-spec.yaml"},{"description":"A mustache designates a property to be inserted from the input\n","template":"Hello {{name}}.","ast":{"type":"Program","body":[{"type":"ContentStatement","original":"Hello ","value":"Hello ","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":6}}},{"type":"MustacheStatement","path":{"type":"PathExpression","data":false,"depth":0,"parts":["name"],"original":"name","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":12}}},"params":[],"escaped":true,"strip":{"open":false,"close":false},"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":14}}},{"type":"ContentStatement","original":".","value":".","loc":{"start":{"line":1,"column":14},"end":{"line":1,"column":15}}}],"strip":{},"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":15}}},"input":{"name":"world"},"output":"Hello world.","filename":"basic/string-placeholder.hb-spec.yaml"}]
