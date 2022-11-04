import { options } from "@shared/module";
export { options as shared } from "@shared/module";
// import { AllService } from "./srv";
export type ItemCallback = (userId: string, service: any) => void;
export type ItemCallbacks = { [key: string]: ItemCallback };
export interface ItemOptions {
  itemCallbacks: ItemCallbacks;
}
export interface ModulesOptions extends options.ModulesOptions {
  item?: ItemOptions;
}
