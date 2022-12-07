import type { Config } from "@jest/types";
import { readFileSync } from "fs";
const { exclude: _, ...swcJestConfig } = JSON.parse(readFileSync(`${__dirname}/.lib.swcrc`, "utf-8"));
const config: Config.InitialOptions = {
  displayName: "decentverse/module",
  preset: "../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/decentverse/module",
};

export default config;
