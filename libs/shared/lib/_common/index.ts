import dynamic from "next/dynamic";
export * from "./icon";
export * from "./layout";
export * from "./login";
export * from "./daisyui";
export * from "./headless";
export * from "./editor";
export const ModalContainer = dynamic(() => import("./ModalContainer").then((mod) => mod.ModalContainer));
export const WindowHeader = dynamic(() => import("./WindowHeader").then((mod) => mod.WindowHeader));
export const DebugConsole = dynamic(() => import("./DebugConsole").then((mod) => mod.DebugConsole));
export const RecentTime = dynamic(() => import("./RecentTime").then((mod) => mod.RecentTime));
export const Field = {
  Children: dynamic(() => import("./Field").then((mod) => mod.Children)),
  Container: dynamic(() => import("./Field").then((mod) => mod.Container)),
  Coordinate: dynamic(() => import("./Field").then((mod) => mod.Coordinate)),
  DatePick: dynamic(() => import("./Field").then((mod) => mod.DatePick)),
  DoubleNumber: dynamic(() => import("./Field").then((mod) => mod.DoubleNumber)),
  Email: dynamic(() => import("./Field").then((mod) => mod.Email)),
  File: dynamic(() => import("./Field").then((mod) => mod.File)),
  ID: dynamic(() => import("./Field").then((mod) => mod.ID)),
  Img: dynamic(() => import("./Field").then((mod) => mod.Img)),
  Imgs: dynamic(() => import("./Field").then((mod) => mod.Imgs)),
  KoreanCityDistrict: dynamic(() => import("./Field").then((mod) => mod.KoreanCityDistrict)),
  Marker: dynamic(() => import("./Field").then((mod) => mod.Marker)),
  Number: dynamic(() => import("./Field").then((mod) => mod.Number)),
  OnOff: dynamic(() => import("./Field").then((mod) => mod.OnOff)),
  Parent: dynamic(() => import("./Field").then((mod) => mod.Parent)),
  Password: dynamic(() => import("./Field").then((mod) => mod.Password)),
  RangePicker: dynamic(() => import("./Field").then((mod) => mod.RangePicker)),
  SelectItem: dynamic(() => import("./Field").then((mod) => mod.SelectItem)),
  SwitchItem: dynamic(() => import("./Field").then((mod) => mod.SwitchItem)),
  Tags: dynamic(() => import("./Field").then((mod) => mod.Tags)),
  Text: dynamic(() => import("./Field").then((mod) => mod.Text)),
  TextArea: dynamic(() => import("./Field").then((mod) => mod.TextArea)),
  LikeDislike: dynamic(() => import("./Field").then((mod) => mod.LikeDislike)),
  Like: dynamic(() => import("./Field").then((mod) => mod.Like)),
};
export * as MapView from "./mapView";
export * from "./web3";
