import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Clay | Ventures Lab",
    template: "./index.html",
  },
  server: {
    port: 5101,
  },
  resolve: {
    alias: {
      "@/*": "./src/*",
    },
  },
});
