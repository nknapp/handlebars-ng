import { showSidebar, toggleSidebar } from "@/store/sidebar";
import { useStore } from "@nanostores/solid";
import type { Component, createSignal, JSXElement } from "solid-js";

export const Sidebar: Component<{ children?: JSXElement }> = (props) => {
  const aside = "absolute w-64 p-4 bg-orange-100 transition h-full";
  const translateLeft = "transform -translate-x-64 duration-300";

  const show = useStore(showSidebar);

  return (
    <aside
      class={aside + " " + (show() ? "" : translateLeft)}
      onClick={toggleSidebar}
    >
      {props.children}
    </aside>
  );
};
