/* eslint-disable import/no-extraneous-dependencies */
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      enabled: true,
      include: ["src/**/*.ts"],
      reportOnFailure: true,
      reporter: ["text", "text-summary", "json", "html", "cobertura"],
    },
    outputFile: {
      junit: "./coverage/junit-report.xml",
    },
    passWithNoTests: true,
    reporters: ["default", "junit"],
    typecheck: {
      checker: "tsc",
      tsconfig: "./tests/tsconfig.json",
    },
  },
});
