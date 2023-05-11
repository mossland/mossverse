import { ReactNode } from "react";
import { InitActionForm, Slice, SliceModel } from "./store";

export type ModelsProps<SL extends Slice<string, any>, M extends { id: string }> = {
  className?: string;
  slice?: SL;
  init?: InitActionForm<M>;
  onClickItem?: (model: M) => any;
};
export type ModelProps<SL extends Slice<string, any>, L extends { id: string }> = {
  [key in SL["refName"]]: L;
} & {
  className?: string;
  slice?: SL;
  onClick?: (model: L) => any;
  actions?: DataAction<L>[];
  columns?: DataColumn<L>[];
  idx: number;
};
export type ModelDashboardProps<SL extends Slice<string, any>, Summary> = {
  className?: string;
  summary: { [key: string]: number };
  queryMap?: { [key: string]: any };
  columns?: (keyof Summary)[];
  hidePresents?: boolean;
  slice?: SL;
};

export type ModelEditProps<SL extends Slice<string, any>> = {
  slice: SL;
};
export type ModelViewProps<SL extends Slice<string, any>> = {
  id?: string;
  slice?: SL;
};
export type DataAction<L> = "edit" | "view" | "remove" | { type: string; render: () => ReactNode };
export type DataTool = { label: string; icon?: ReactNode; onClick: () => void | Promise<void> };
export type DataColumn<L> =
  | string
  | { key: keyof L; responsive?: boolean; render?: (value: any, model: L) => ReactNode; only?: "user" | "admin" };
export type DataMenuItem = {
  key: string;
  label: string;
  icon: ReactNode;
  render: () => ReactNode | JSX.Element;
};
