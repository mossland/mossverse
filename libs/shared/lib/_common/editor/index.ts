import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("./Editor"), { ssr: false });
export const BlockEditor = dynamic(() => import("./BlockEditor"));
export const BlockCommentor = dynamic(() => import("./BlockCommentor"));
export const BlockRenderer = dynamic(() => import("./BlockRenderer").then((mod) => mod.BlockRenderer));
