import { option as decentverse } from "@decentverse/server";
import { option as platform } from "@platform/server";
import { option as shared } from "@shared/server";
import { option as social } from "@social/server";
export { option as shared } from "@shared/server";
export { option as platform } from "@platform/server";
export { option as decentverse } from "@decentverse/server";
export type ModulesOptions = shared.ModulesOptions &
  platform.ModulesOptions &
  social.ModulesOptions &
  decentverse.ModulesOptions & {
    mossland: MocOptions;
  };

export type MocOptions = {
  luniverse: {
    accessKey: string;
    secretKey: string;
  };
};
