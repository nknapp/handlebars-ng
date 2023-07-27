import { Component, JSXElement } from "solid-js";
import { Transition, TransitionProps } from "solid-transition-group";

type TransitionName = "fade";

export interface MyTransitionProps {
  name: TransitionName;
  children: JSXElement;
}

const transitionProps: Record<TransitionName, TransitionProps> = {
  fade: {
    enterClass: "opacity-0",
    enterActiveClass: "duration-700 transition-opacity",
    exitActiveClass: "duration-700 transition-opacity",
    exitToClass: "opacity-0",
  },
};

export const MyTransition: Component<MyTransitionProps> = (props) => {
  return (
    <Transition {...transitionProps[props.name]}>{props.children}</Transition>
  );
};
