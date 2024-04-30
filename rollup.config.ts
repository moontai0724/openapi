import path from "node:path";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import minifier from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const dist = "dist";

const commonPlugins = [
  typescript(),
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
  }),
];

const minifiedPlugins = [
  ...commonPlugins,
  minifier({
    compress: true,
  }),
];

export default [
  // cjs
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.js"),
      format: "cjs",
      sourcemap: true,
    },
    plugins: commonPlugins,
  },
  // esm
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.mjs"),
      format: "es",
      sourcemap: true,
    },
    plugins: commonPlugins,
  },
  // min.cjs
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.min.js"),
      format: "cjs",
      sourcemap: true,
    },
    plugins: minifiedPlugins,
  },
  // min.esm
  {
    input: "src/index.ts",
    output: {
      file: path.join(dist, "index.min.mjs"),
      format: "es",
      sourcemap: true,
    },
    plugins: minifiedPlugins,
  },
  // dts
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
      sourcemap: false,
    },
    plugins: [
      typescript(),
      dts({
        respectExternal: true,
      }),
    ],
  },
];
