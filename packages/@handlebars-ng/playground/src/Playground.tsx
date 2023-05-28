import type { Component } from "solid-js";
import { CodeEditor } from "./internal-components/CodeEditor";
import { createMemo, createSignal } from "solid-js";
import json5 from "json5";
import prettier from "prettier/standalone";
import parserBabel from 'prettier/parser-babel'

const initialValues: PlaygroundModel = {
  template: "{{firstname}} {{loud lastname}}",
  setupScript: `Handlebars.registerHelper('loud', (aString) => {
    return aString.toUpperCase()
})
`,
  input: {
    firstname: "Yehuda",
    lastname: "Katz",
  },
};

export interface PlaygroundModel {
  template: string;
  setupScript: string;
  input: Record<string, unknown>;
}

export const Playground: Component = () => {
  const [template, setTemplate] = createSignal(initialValues.template);
  const [setupScript, setSetupScript] = createSignal(initialValues.setupScript);
  const [input, setInput] = createSignal(initialValues.input);

  const prettyInput = createMemo(() => {
    return prettier.format(json5.stringify(input()), { parser: "json5",  plugins:[parserBabel]});
  });

  return (
    <div class={"border bg-amber-50 rounded-lg p-2 shadow-lg"}>
      <div class={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <CodeEditor
          label="Template"
          value={template()}
          onInput={setTemplate}
          language={"handlebars"}
        />
        <CodeEditor
          label="Setup script"
          value={setupScript()}
          onInput={setSetupScript}
          language={"javascript"}
        />
        <CodeEditor
          label="Input"
          value={prettyInput()}
          onInput={(value) => setInput(json5.parse(value))}
          language={"json"}
        />
      </div>
    </div>
  );
};
