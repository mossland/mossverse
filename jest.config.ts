import { getJestProjects } from "@nrwl/jest";
import type { Config } from "@jest/types";
import * as fs from "fs";
const swcrc = JSON.parse(fs.readFileSync("./.swcrc", "utf-8").toString());
const config: Config.InitialOptions = {
  projects: getJestProjects() as string[],
  collectCoverageFrom: [
    "apps/**/*.ts",
    "libs/**/*.ts",
    "!main.ts",
    "!**/*.module.ts",
    "!**/*.input.ts",
    "!**/*.entity.ts",
    "!**/*.args.ts",
    "!**/*.helper.ts",
    "!**/*.types.ts",
    "!**/*.entities.ts",
    "!**/*.helpers.ts",
    "!**/node_modules/**",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", swcrc],
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 50,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: "node",
  detectOpenHandles: true,
};
export default config;
