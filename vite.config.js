import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

export default defineConfig(async (options) => {
    if (options.mode === "development") {
        return {
            plugins: [react(), wasm()],
            server: {
                hmr: true,
            },
        };
    }
    if (options.mode === "production") {
        return {
            build: {
                outDir: "build",
                emptyOutDir: true,
            },
            plugins: [react(), wasm()],
        };
    }
});
