import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import packageJson from "./package.json";

const name = packageJson.name.split("/").pop();

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name,
      fileName: "index",
    },
  },
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, "src/tsconfig.build.json"),
      rollupTypes: true,
    }),
  ],
});
