import type { Component } from "solid-js"
import { createImpress } from "./impressed"


export const Impress: Component = () => {
    
    return <div>{createImpress()}</div>
}