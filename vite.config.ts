import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
   resolve: {
    alias: {
      // 👉 force Vite to load the browser bundle of Parse
      parse: "parse/dist/parse.min.js",
    },
  },
  define: {
    // some polyfilled modules expect a global object
    global: "globalThis",
  },
  plugins: [
    nodePolyfills({
      // enable core-module polyfills for browser
      protocolImports: true,
      // shim Buffer, process, global if needed
      globals: {
        Buffer: true,
        process: true,
        global: true,
      },
    }),
    react()
  ],
});
