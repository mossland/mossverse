import { DocumentNode, OperationVariables } from "@apollo/client";
import { cnst } from "@shared/util";
import { State, StoreApi, UseBoundStore } from "zustand";
import { isMobile } from "react-device-detect";
import { MetaMaskInpageProvider } from "@metamask/providers";
import * as pluralize from "pluralize";
import "reflect-metadata";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Caver = require("caver-js");

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
  }
}

const METAMASK_ETHEREUM_MAINNET = 1;
const METAMASK_ETHEREUM_ROPSTEN = 3;
const METAMASK_ETHEREUM_RINKEBY = 4;
const METAMASK_LUNIVERSE = 128;
const METAMASK_LUNIVESER_TESTNET = 256;

const KLAYTN_BAOBABNET = 1001;
const KLAYTN_CYPRESS = 8217;

export const getMetamaskNetwork = (chainId: number) =>
  chainId === METAMASK_ETHEREUM_MAINNET
    ? "Ethereum Mainnet"
    : chainId === METAMASK_ETHEREUM_ROPSTEN
    ? "Ethereum Ropsten"
    : chainId === METAMASK_ETHEREUM_RINKEBY
    ? "Ethereum Rinkeby"
    : chainId === METAMASK_LUNIVERSE
    ? "Luniverse Testnet"
    : chainId === METAMASK_LUNIVESER_TESTNET
    ? "Luniverse Mainnet"
    : "unknown network";

export const getKlaytnNetwork = (chainId: number) =>
  chainId === KLAYTN_CYPRESS ? "Klaytn mainnet" : chainId === KLAYTN_BAOBABNET && "Klaytn testnet";

export const signMetamask = async (message: string, account: string) => {
  if (!window.ethereum) return;
  return await window.ethereum.request<string>({ method: "personal_sign", params: [message, account] });
};
export const signKaikas = async (message: string, account: string) => {
  if (!window.klaytn) return;
  const caver = new Caver(window.klaytn);
  return await caver.klay.sign(message, account);
};
export const getAccount = async (network?: cnst.NetworkProvider, networkId?: number) => {
  if (!network || !networkId) {
    throw new Error("network not found");
  }
  if (network === "ethereum") {
    if (typeof window.ethereum === "undefined" || !window.ethereum.chainId) return;
    const chainId: number = parseInt(window.ethereum.chainId);

    if (chainId !== networkId) {
      alert(
        `네트워크가 유효하지 않습니다. 네트워크를 확인해주세요.
    \n연결하려는 네트워크 : ${getMetamaskNetwork(networkId)}\n현재 네트워크 : ${getMetamaskNetwork(chainId)}`
      );
      throw new Error(
        `can not found ${network} network, connect network : ${getMetamaskNetwork(
          networkId
        )}, curent network : ${getMetamaskNetwork(chainId)}`
      );
    }
    const account: string[] = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    if (!account) return;
    return account[0].toLowerCase();
  } else if (network === "klaytn") {
    if (isMobile) return window.alert("Kaikas는 현재 PC만 지원합니다.");
    if (!window.klaytn) return window.alert("Kaikas를 다운로드 해주세요.");
    if (networkId !== window.klaytn.networkVersion) {
      alert(
        `네트워크가 유효하지 않습니다. 네트워크를 확인해주세요.
    \n연결하려는 네트워크 : ${getKlaytnNetwork(networkId)}\n현재 네트워크 : ${getKlaytnNetwork(
          window.klaytn.networkVersion
        )}`
      );
      throw new Error(
        `can not found ${network} network, connect network : ${getMetamaskNetwork(
          window.klaytn.networkVersion
        )}, curent network : ${getMetamaskNetwork(networkId)}`
      );
    }
    const account = (await window.klaytn.enable())[0] as string;
    return account.toLowerCase();
  }
};

export type Nullable<T> = { [K in keyof T]: T[K] | null };
