/// <reference types="vitest/config" />
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "node:url"
import { resolve } from "path";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), dts(), tailwindcss()],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            name: "suff",
            fileName: "suff"
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    test: {},
});
