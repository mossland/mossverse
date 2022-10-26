import type { Config } from "@jest/types";
import * as fs from "fs";
const swcrc = JSON.parse(fs.readFileSync(`${__dirname}/.lib.swcrc`, "utf-8").toString());
swcrc.jsc.minify = null;
const config: Config.InitialOptions = {
  displayName: "platform/data-access",
  preset: "../../../jest.preset.js",
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "<rootDir>/tsconfig.spec.json",
  //   },
  // },
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", swcrc],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/libs/platform/data-access",
};

export default config;
