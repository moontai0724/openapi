import path from "node:path";

import babel from "@rollup/plugin-babel";
import minifier from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const dist = "dist";

export default [
  // cjs
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.js"),
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      typescript(),
      babel({
        babelHelpers: "bundled",
      }),
    ],
  },
  // esm
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.mjs"),
      format: "es",
      sourcemap: true,
    },
    plugins: [
      typescript({
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
      }),
    ],
  },
  // min.cjs
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.min.js"),
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      typescript(),
      babel({
        babelHelpers: "bundled",
      }),
      minifier({
        compress: true,
      }),
    ],
  },
  // min.esm
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.min.mjs"),
      format: "es",
      sourcemap: true,
    },
    plugins: [
      typescript({
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
      }),
      minifier({
        compress: true,
      }),
    ],
  },
  // dts
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
      sourcemap: false,
    },
    plugins: [typescript(), dts()],
  },
];
