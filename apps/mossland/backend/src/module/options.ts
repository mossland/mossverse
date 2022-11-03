import { options } from "@platform/module";
export { options as shared } from "@shared/module";
export { options as platform } from "@platform/module";
export { options as decentverse } from "@decentverse/module";
export type ModulesOptions = options.ModulesOptions & {
  mossland: MocOptions;
};

export type MocOptions = {
  luniverse: {
    accessKey: string;
    secretKey: string;
  };
};
