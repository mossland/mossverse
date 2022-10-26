import type { Config } from "@jest/types";
import * as fs from "fs";
const swcrc = JSON.parse(fs.readFileSync(`${__dirname}/.lib.swcrc`, "utf-8").toString());
swcrc.jsc.minify = null;
const config: Config.InitialOptions = {
  displayName: "mossland/frontend",
  preset: "../../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nrwl/react/plugins/jest",
    "^.+\\.[tj]sx?$": ["@swc/jest", swcrc],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/apps/mossland/frontend",
};

export default config;
