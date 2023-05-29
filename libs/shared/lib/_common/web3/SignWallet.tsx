"use client";
import { Kaikas, Metamask, WalletConnect, WalletNetworkType, WalletType } from "./wallet";
import { client, encrypt } from "@util/client";
import { twMerge } from "tailwind-merge";

export interface SignKaikasProps {
  walletType: WalletType;
  networkType: WalletNetworkType;
  className?: string;
  message?: string;
  address?: string;
  onSigned?: () => void;
  disabled?: boolean;
  children: any;
}
export default function SignWallet({
  className,
  walletType,
  networkType,
  message = "Connect Wallet",
  address,
  onSigned,
  disabled,
  children,
}: SignKaikasProps) {
  const sign = async () => {
    if (disabled) return;
    const wallet =
      walletType === "metamask"
        ? await new Metamask(networkType).init()
        : walletType === "kaikas"
        ? await new Kaikas(networkType).init()
        : walletType === "walletConnect"
        ? await new WalletConnect(networkType).init()
        : null;
    if (!wallet) throw new Error("wallet is null");
    const signer = address ?? (await wallet.getAccount());
    const hash = await encrypt(signer);
    const signmessage = `${message} jwt:[${hash}] timeStamp:${Date.now()}`;
    const signature = await wallet.sign(signmessage);
    client.setSignature(signature, signer);
    onSigned?.();
  };
  return (
    <div className={twMerge("cursor-pointer", className)} onClick={sign}>
      {children}
    </div>
  );
}
