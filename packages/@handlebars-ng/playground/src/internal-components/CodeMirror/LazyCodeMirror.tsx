import { Component, createSignal, lazy, onMount } from "solid-js";
import { CodeMirrorProps } from "./CodeMirror.types";

const LazyCodeMirror = lazy(() => import("./CodeMirror"));

export const CodeMirror: Component<CodeMirrorProps> = (props) => {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => {
      setTimeout(() => {
          setMounted(true);
      },0 )
  });
  return (
    <div class={"opacity-0 h-full duration-700"} classList={{ "opacity-100": mounted() }}>
      <LazyCodeMirror {...props} />
    </div>
  );
};
