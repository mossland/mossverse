import { option } from "@platform/module";
export { option as shared } from "@shared/module";
export { option as platform } from "@platform/module";
export { option as decentverse } from "@decentverse/module";
export type ModulesOptions = option.ModulesOptions & {
  mossland: MocOptions;
};

export type MocOptions = {
  luniverse: {
    accessKey: string;
    secretKey: string;
  };
};
