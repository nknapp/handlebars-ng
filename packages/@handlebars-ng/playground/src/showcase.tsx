import { render } from "solid-js/web";
import { Playground } from "./Playground";
import "./index.css";

const root = document.getElementById("root");

if (root == null || !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?",
  );
}

render(() => <Playground />, root);
