import type { Component } from "solid-js";
import { CodeEditor } from "./internal-components/CodeEditor";
import { createResource, createSignal } from "solid-js";
import { createHandlebars4xExecutor } from "./execution/handlebars4x";
import { Spinner } from "./internal-components/CodeEditor/Spinner";
import { createHandlebarsNgExecutor } from "./execution/handlebars-ng";
import { normalizeAst } from "@handlebars-ng/specification";

const initialValues: PlaygroundModel = {
  template: "{{firstname}} {{loud lastname}}",
};

export interface PlaygroundModel {
  template: string;
}

export const Playground: Component = () => {
  const [template, setTemplate] = createSignal(initialValues.template);

  const executor4x = createHandlebars4xExecutor();
  const [ast4x] = createResource(template, async (template) =>
    normalizeAst(await executor4x.parse(template))
  );

  const executorNg = createHandlebarsNgExecutor();
  const [astNg] = createResource(template, async (template) =>
    normalizeAst(await executorNg.parse(template))
  );

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
      <div class={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div>
          <h2 class={"text-lg relative"}>
            Abstract Syntax Tree (Handlebars 4.x) {ast4x.loading && <Spinner />}
          </h2>
          {ast4x.state === "errored" && (
            <span class={"text-red-500"}>Error</span>
          )}
          <pre>
            {ast4x.state === "ready" && JSON.stringify(ast4x(), null, 2)}
          </pre>
        </div>
        <div>
          <h2 class={"text-lg relativ"}>
            Abstract Syntax Tree (Handlebars Ng) {astNg.loading && <Spinner />}
          </h2>
          {astNg.state === "errored" && (
            <span class={"text-red-500"}>Error</span>
          )}
          <pre>
            {astNg.state === "ready" && JSON.stringify(astNg(), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
