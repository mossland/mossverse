import dynamic from "next/dynamic";

export const ConnectButton = dynamic(() => import("./ConnectButton").then((mod) => mod.ConnectButton));
export const LoginSelector = dynamic(() => import("./LoginSelector").then((mod) => mod.LoginSelector));
export const LoginSelectorMobile = dynamic(() =>
  import("./LoginSelectorMobile").then((mod) => mod.LoginSelectorMobile)
);
export const LoginButton = dynamic(() => import("./LoginButton").then((mod) => mod.LoginButton));
export const MetaLoginButton = dynamic(() => import("./MetaLoginButton").then((mod) => mod.MetaLoginButton));
