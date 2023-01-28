import { Program } from "./types/ast";
import { ContentRenderer } from "./renderer/ContentRenderer";
import { MustacheRenderer } from "./renderer/MustacheRenderer";
import { ProgramRenderer } from "./renderer/ProgramRenderer";
import { RenderContext } from "./renderer/RenderContext";
import {
  getRendererForNode,
  registerNodeRenderer as registerNodeRenderer,
} from "./renderMapping";
import { HelperFn } from "./types/helper";

type Runnable = (input: Record<string, unknown>) => string;

registerNodeRenderer("Program", ProgramRenderer);
registerNodeRenderer("MustacheStatement", MustacheRenderer);
registerNodeRenderer("ContentStatement", ContentRenderer);

export class HandlebarsNgRunner {
  helpers: Map<string, HelperFn> = new Map();

  compile(ast: Program): Runnable {
    const renderer = getRendererForNode(ast);
    return (input) => {
      const context: RenderContext = {
        input,
        output: "",
        helpers: this.helpers,
      };
      renderer.render(context);
      return context.output;
    };
  }

  registerHelper(name: string, fn: HelperFn) {
    this.helpers.set(name, fn);
  }
}
