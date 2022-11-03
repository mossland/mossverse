import type { Config } from "@jest/types";
import * as fs from "fs";
const swcrc = JSON.parse(fs.readFileSync(`${__dirname}/.lib.swcrc`, "utf-8").toString());
swcrc.jsc.minify = null;
const config: Config.InitialOptions = {
  displayName: "decentverse/data-access",
  preset: "../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": ["@swc/jest", swcrc],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/libs/decentverse/data-access",
};

export default config;
