import { option as shared } from "@shared/module";
import { option as platform } from "@platform/module";
import { option as decentverse } from "@decentverse/module";
export { option as shared } from "@shared/module";
export { option as platform } from "@platform/module";
export { option as decentverse } from "@decentverse/module";
export type ModulesOptions = shared.ModulesOptions &
  platform.ModulesOptions &
  decentverse.ModulesOptions & {
    mossland: MocOptions;
  };

export type MocOptions = {
  luniverse: {
    accessKey: string;
    secretKey: string;
  };
};
