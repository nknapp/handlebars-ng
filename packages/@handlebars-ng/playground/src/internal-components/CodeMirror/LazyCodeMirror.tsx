import { Component, lazy } from "solid-js";
import { CodeMirrorProps } from "./CodeMirror.types";
import { MyTransition } from "../MyTransition";

const LazyCodeMirror = lazy(() => import("./CodeMirror"));

export const CodeMirror: Component<CodeMirrorProps> = (props) => {
  return (
    <div class="relative">
      <LazyCodeMirror {...props} />
      <MyTransition name="fade">
        {props.overlayText != null && (
          <div
            data-test="overlay"
            class="absolute inset-0 flex items-center justify-center bg-white/10"
          >
            <div class="text-lg">{props.overlayText}</div>
          </div>
        )}
      </MyTransition>
    </div>
  );
};
