import { Component, createResource, createSignal } from "solid-js";
import { CodeEditor } from "./internal-components/CodeEditor";
import { AstView } from "./internal-components/AstView/AstView";
import { createLocalHbsNgExecutor } from "./execution/handlebars-ng/createLocalHbsNgExecutor";

const initialValues: PlaygroundModel = {
  template: "{{firstname}} {{loud lastname}}",
};

export interface PlaygroundModel {
  template: string;
}

export const Playground: Component = () => {
  const [template, setTemplate] = createSignal(initialValues.template);
  const executor = createLocalHbsNgExecutor();
  const [astNg] = createResource(template, async (template) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      return await executor.parse(template);
    } catch (error) {
      return undefined;
    }
  });

  return (
    <div class={"border bg-amber-50 rounded-lg p-2 shadow-lg"}>
      <div class={"grid grid-cols-1 gap-4 mb-4"}>
        <CodeEditor
          label="Template"
          value={template()}
          onInput={setTemplate}
          language={"handlebars"}
        />
      </div>
      <div>
        <AstView label="AST" ast={astNg()} loading={astNg.loading} />
      </div>
    </div>
  );
};
