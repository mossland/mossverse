"use client";
import { ERC20, erc20, erc721 } from "@contract";
import { Utils, WalletSign } from "@util/client";
import { ethers } from "ethers";
import { isMobile } from "react-device-detect";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WC from "@walletconnect/client";
import WalletConnectProvider from "@walletconnect/web3-provider";
import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: any;
    caver: any;
  }
}
export type WalletType = "kaikas" | "metamask" | "walletConnect";
export type WalletNetworkType = "mainnet" | "testnet" | "debugnet";
type Chain = { name: string; chainId: string };
type ChainMap = { [key in WalletNetworkType]: Chain };

export abstract class Wallet {
  chain: Chain;
  supportedChains: ChainMap;
  init: () => Promise<Wallet>;
  sign: (message: string, address?: string) => Promise<WalletSign>;
  getAccount: () => Promise<string>;
  sendValue: (value: number, to: string, account?: string) => Promise<string>;
  sendErc20: (contract: string, num: number, to: string, account?: string) => Promise<string>;
  // setApprovalForAll: (ctrAddr: string, operator: string) => Promise<string>;
}
export class Metamask implements Wallet {
  chain: Chain;
  provider: ethers.providers.Web3Provider;
  supportedChains: ChainMap = {
    mainnet: { name: "Ethereum Mainnet", chainId: "1" },
    testnet: { name: "Ethereum Goerli Testnet", chainId: "5" },
    debugnet: { name: "Ethereum Akamir Debugnet", chainId: "5777" },
  };
  constructor(networkType: WalletNetworkType) {
    if (!window?.ethereum?.isMetaMask) throw new Error("No Metamask");
    this.chain = this.supportedChains[networkType];
    if (!this.chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
  }
  async init() {
    return this;
  }
  async sign(signmessage: string, address?: string) {
    await this.#validateChain(address);
    const account = await this.getAccount();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = (await window.ethereum.request<string>({
      method: "personal_sign",
      params: [signmessage, address ?? account],
    })) as string;
    return { signchain: this.chain.chainId, signmessage, signaddress };
  }
  async getAccount() {
    const [address] = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain(address?: string) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: Utils.decToHex(parseInt(this.chain.chainId)) }],
    });
    if (address && address !== (await this.getAccount()))
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    return this;
  }
  async sendValue(value: number, to: string, account?: string) {
    await this.#validateChain(account);
    const signer = this.provider.getSigner();
    const receipt = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(value.toString()),
    });
    return receipt.hash;
  }
  async sendErc20(ctrAddr: string, num: number, to: string, account?: string) {
    await this.#validateChain(account);
    const signer = this.provider.getSigner();
    const contract = new ethers.Contract(ctrAddr, erc20.abi, signer) as ERC20;
    const decimals = await contract.decimals();
    const value = ethers.utils.parseUnits(num.toString(), decimals);
    const gasPrice = await this.provider.getGasPrice();
    const receipt = await contract.connect(signer).transfer(to, value, { gasLimit: 100000, gasPrice });
    return receipt.hash;
  }
}
export class Kaikas implements Wallet {
  chain: Chain;
  supportedChains: ChainMap = {
    mainnet: { name: "Cypress Mainnet", chainId: "8217" },
    testnet: { name: "Baobab Testnet", chainId: "1001" },
    debugnet: { name: "No Network", chainId: "0" },
  };
  constructor(networkType: WalletNetworkType) {
    if (isMobile) {
      window.alert("Kaikas is not supported on mobile");
      throw new Error("Kaikas is not supported on mobile");
    }
    if (!window?.klaytn) {
      window.alert("Kaikas plugin is not installed");
      throw new Error("No Kaikas");
    }
    this.chain = this.supportedChains[networkType];
    if (!this.chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
  }
  async sign(signmessage: string, address?: string) {
    await this.#validateChain();
    const account = await this.getAccount();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = await window.caver.klay.sign(signmessage, address ?? account);
    return { signchain: this.chain.chainId, signmessage, signaddress };
  }
  async init() {
    return this;
  }
  async getAccount() {
    const [address] = (await window.klaytn.enable()) as string[];
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain(account?: string) {
    await window.klaytn.sendAsync(
      {
        method: "wallet_switchKlaytnChain",
        params: [{ chainId: Utils.decToHex(parseInt(this.chain.chainId)) }],
      },
      () => {
        //
      }
    );
    return this;
  }
  async sendValue(value: number, to: string, account?: string) {
    await this.#validateChain(account);
    const from = await this.getAccount();
    const receipt = await window.caver.klay.sendTransaction({
      type: "VALUE_TRANSFER",
      from,
      to,
      value: window.caver.utils.toPeb(value.toString(), "KLAY"),
    });
    return receipt.transactionHash;
    // .once("receipt", (receipt) => {
    //   console.log("receipts", receipt);
    // })
  }
  async sendErc20(ctrAddr: string, num: number, to: string, account?: string) {
    await this.#validateChain(account);
    const from = await this.getAccount();
    const contract = new window.caver.klay.Contract(erc20.abi, ctrAddr);
    const decimals = await contract.methods.decimals().call();
    const value = ethers.utils.parseUnits(num.toString(), decimals);
    const gas = await contract.methods.transfer(to, value).estimateGas({ from });
    const receipt = await contract.methods.transfer(to, value).send({ from, gas });
    return receipt.transactionHash;
  }

  async setApprovalForAll(ctrAddr: string, operator: string) {
    const from = await this.getAccount();
    await this.#validateChain(from);
    const contract = new window.caver.klay.Contract(erc721.abi, ctrAddr);
    const approved = await contract.methods.isApprovedForAll(from, operator).call();
    if (!approved) {
      const gas = await contract.methods.setApprovalForAll(operator, true).estimateGas({ from });
      await contract.methods.setApprovalForAll(operator, true).send({ from, gas });
    }
  }
}

export class WalletConnect implements Wallet {
  connector = new WC({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal,
    qrcodeModalOptions: {
      desktopLinks: ["metamask"],
      mobileLinks: ["metamask"],
    },
  });
  chainId: string;
  supportedChains: ChainMap = {
    mainnet: { name: "Ethereum Mainnet", chainId: "1" },
    testnet: { name: "Ethereum Goerli Testnet", chainId: "5" },
    debugnet: { name: "Ethereum Akamir Debugnet", chainId: "5777" },
  };
  chain: Chain;
  provider: ethers.providers.Web3Provider;
  constructor(networkType: WalletNetworkType) {
    this.chain = this.supportedChains[networkType];
    if (!this.chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
  }
  async init() {
    await this.connector.connect();
    const provider = new WalletConnectProvider({
      infuraId: "18c4c35f8c34449eb503d9366233a525",
      connector: this.connector,
    });
    await provider.enable();
    this.provider = new ethers.providers.Web3Provider(provider);
    return this;
  }
  async sign(signmessage: string, address?: string) {
    await this.#validateChain();
    const account = await this.getAccount();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = await this.connector.signPersonalMessage([signmessage, address ?? account]);
    return { signchain: this.chainId, signmessage, signaddress };
  }
  async getAccount() {
    const [address] = (await this.connector.sendCustomRequest({
      method: "eth_requestAccounts",
    })) as string[];
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain() {
    await this.connector.sendCustomRequest({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: Utils.decToHex(parseInt(this.chain.chainId)) }],
    });
    return this;
  }
  async sendValue(value: number, to: string) {
    await this.#validateChain();
    const receipt = await this.connector.sendTransaction({
      from: await this.getAccount(),
      value: ethers.utils.parseEther(value.toString()).toString(),
      to,
    });
    return receipt;
  }
  async sendErc20(ctrAddr: string, num: number, to: string, account?: string) {
    await this.#validateChain();
    const signer = this.provider.getSigner();
    const contract = new ethers.Contract(ctrAddr, erc20.abi, this.provider) as ERC20;
    const decimals = await contract.decimals();
    const value = ethers.utils.parseUnits(num.toString(), decimals);
    const gasPrice = await this.provider.getGasPrice();
    const receipt = await contract.connect(signer).transfer(to, value, { gasLimit: 100000, gasPrice });
    return receipt.hash;
  }
}

// let link: string;
// if (isMobile) {
//   link = `https://metamask.app.link/dapp/${window.location.href.slice(
//     window.location.protocol === "http:" ? 7 : 8,
//     window.location.href.length
//   )}`;
//   // setLink(link);
//   window.location.assign(link);
// } else {
//   link = "https://metamask.io/download/";
//   const win = window.open(link, "_blank");
//   win?.focus();
// }
// };
