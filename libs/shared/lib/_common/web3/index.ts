import dynamic from "next/dynamic";
export const SignWallet = dynamic(() => import("./SignWallet"), { ssr: false });
