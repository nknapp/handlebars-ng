import { showSidebar, toggleSidebar } from "@/layouts/default/sidebar-store";
import { useStore } from "@nanostores/solid";
import type { Component, JSXElement } from "solid-js";

export const Sidebar: Component<{ children?: JSXElement }> = (props) => {
  const aside = "w-64 p-4 bg-orange-100 transition h-full drop-shadow-lg lg:filter-none";
  const translateLeft = "transform -translate-x-64 duration-300 lg:translate-x-0";

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
