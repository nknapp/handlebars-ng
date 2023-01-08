import { Program } from "@handlebars-ng/specification/ast";
import { ContentRenderer } from "./renderer/ContentRenderer";
import { MustacheRenderer } from "./renderer/MustacheRenderer";
import { ProgramRenderer } from "./renderer/ProgramRenderer";
import { RenderContext } from "./renderer/RenderContext";
import {
  getRendererForNode,
  registerNodeRenderer as registerNodeRenderer,
} from "./renderMapping";

type Runnable = (input: Record<string, unknown>) => string;

registerNodeRenderer("Program", ProgramRenderer);
registerNodeRenderer("MustacheStatement", MustacheRenderer);
registerNodeRenderer("ContentStatement", ContentRenderer);

export function compile(ast: Program): Runnable {
  const renderer = getRendererForNode(ast);
  return (input) => {
    const context: RenderContext = {
      input,
      output: "",
    };
    renderer.render(context);
    return context.output;
  };
}
