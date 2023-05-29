import type { Component } from "solid-js";
import { CodeEditor } from "./internal-components/CodeEditor";
import { createResource, createSignal } from "solid-js";
import { createHandlebars4xExecutor } from "./execution/handlebars4x";
import { Spinner } from "./internal-components/CodeEditor/Spinner";

const initialValues: PlaygroundModel = {
  template: "{{firstname}} {{loud lastname}}",
};

export interface PlaygroundModel {
  template: string;
}

export const Playground: Component = () => {
  const [template, setTemplate] = createSignal(initialValues.template);

  const executor = createHandlebars4xExecutor();
  const [ast] = createResource(template, async (template) =>
    executor.parse(template)
  );

  return (
    <div class={"border bg-amber-50 rounded-lg p-2 shadow-lg"}>
      <div class={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <CodeEditor
          label="Template"
          value={template()}
          onInput={setTemplate}
          language={"handlebars"}
        />
      </div>
      <h2 class={"text-lg relative"}>
        Abstract Syntax Tree (Handlebars 4.x) {ast.loading && <Spinner />}
      </h2>
      <pre>{JSON.stringify(ast(), null, 2)}</pre>
    </div>
  );
};
