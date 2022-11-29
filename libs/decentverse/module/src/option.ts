import { option } from "@shared/module";
export { option as shared } from "@shared/module";
// import { AllService } from "./srv";
export type ItemCallback = (userId: string, service: any) => void;
export type ItemCallbacks = { [key: string]: ItemCallback };
export interface ItemOptions {
  itemCallbacks: ItemCallbacks;
}
export interface ModulesOptions extends option.ModulesOptions {
  item?: ItemOptions;
}
