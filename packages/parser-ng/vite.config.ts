/// <reference types="vitest/" />

import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: "src/index.ts",
        },
        outDir: "dist",
        sourcemap: true,
        minify: false,
        target: "esnext"
    },
    test: {
        globals: true
    },
})