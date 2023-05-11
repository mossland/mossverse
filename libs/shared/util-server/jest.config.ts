import type { Config } from "@jest/types";
import { readFileSync } from "fs";
const { exclude: _, ...swcJestConfig } = JSON.parse(readFileSync(`${__dirname}/.lib.swcrc`, "utf-8"));
const config: Config.InitialOptions = {
  displayName: "shared/util-server",
  preset: "../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/shared/util-server",
};

export default config;
