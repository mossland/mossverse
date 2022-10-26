import type { Config } from "@jest/types";
import * as fs from "fs";
const swcrc = JSON.parse(fs.readFileSync(`${__dirname}/.lib.swcrc`, "utf-8").toString());
swcrc.jsc.minify = null;
const config: Config.InitialOptions = {
  displayName: "shared/test-server",
  preset: "../../../jest.preset.js",
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "<rootDir>/tsconfig.spec.json",
  //   },
  // },
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["@swc/jest", swcrc],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/shared/test-server",
};

export default config;
