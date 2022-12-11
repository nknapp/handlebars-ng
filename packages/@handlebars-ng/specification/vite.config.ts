/// <reference types="vitest" />

import {resolve} from 'path'
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts({include: "src"})],
    build: {
        outDir: "dist",
        lib: {
            entry: {
                "spec": resolve(__dirname, 'src', '__generated__', "spec.ts"),
            },
            formats: ['es', "cjs"],
            name: "specification"
        },
        sourcemap: true,
        minify: false,
        target: "esnext"
    },
    test: {
        globals: true
    }
})