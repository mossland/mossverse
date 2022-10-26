import { Utils } from "@shared/util";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export const connect = async (connector: WalletConnect) => {
  return await connector.connect();
};

export const addNetwork = async (
  connector: WalletConnect,
  params: { chainId: number; chainName: string; tokenName: string; symbol: string; rpcUrl: string }
) => {
  return await connector.sendCustomRequest({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: Utils.decToHex(params.chainId),
        chainName: params.chainName,
        nativeCurrency: {
          name: params.tokenName,
          symbol: params.symbol,
          decimals: 18,
        },
        rpcUrls: [params.rpcUrl],
      },
    ],
  });
};

export const switchNetwork = async (connector: WalletConnect, chainId: number) => {
  return await connector.sendCustomRequest({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: Utils.decToHex(chainId) }],
  });
};

export const personalSign = async (connector: WalletConnect, message: string[]) => {
  return await connector.signPersonalMessage(message);
};
