import { useEffect } from "react";
import { userStore, worldStore } from "../../stores";
import styled from "styled-components";
import { KlaytnIcon, LuniverseIcon, LuniverseBlueIcon, EthereumIcon } from "../common";
import { Utils } from "@shared/util";
import { darken } from "polished";
import { walletStore, keyringStore } from "@shared/data-access";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

export const WalletList = () => {
  const self = userStore.use.self();
  const wallets = walletStore.use.wallets();
  const removeWallet = walletStore.use.removeWallet();
  const onClickButton = () => {
    keyringStore.setState({ isOpenModal: true });
  };
  const activeWallets = walletStore.use.activeWallets();
  const checkIsCurrentAddress = (chain: "ethereum" | "klaytn", address: string) => {
    const currentAddress = activeWallets.find((cur) => cur.network.provider === chain)?.address;
    return currentAddress === address;
  };

  const onClickRemove = (address: string, walletId: string) => {
    if (!self?.keyring?.id) return;
    removeWallet(self?.keyring?.id, walletId, address);
  };

  if (!wallets) return null;

  return (
    <WalletListContainer>
      <div className="label">
        Your Wallets
        <PlusCircleOutlined onClick={onClickButton} />
      </div>
      <div className="wallet-list">
        {wallets.map((wallet) => (
          <div className="wallet-item">
            <ChainImage chain={wallet.network.provider} />
            {Utils.centerEllipsis(wallet.address)}
            {!checkIsCurrentAddress(wallet.network.provider, wallet.address) && (
              <Popconfirm
                placement="topRight"
                title="삭제하시겠습니까?"
                onConfirm={() => onClickRemove(wallet.address, wallet.id)}
                okText="Yes"
                cancelText="No"
              >
                <MinusCircleOutlined className="minus-button" />
              </Popconfirm>
            )}
          </div>
        ))}
      </div>
    </WalletListContainer>
  );
};

export const ChainImage = ({ chain }: { chain: "ethereum" | "klaytn" | "luniverse" }) => {
  if (chain === "klaytn") return <KlaytnIcon />;
  if (chain === "luniverse") return <LuniverseIcon />;
  if (chain === "ethereum") return <EthereumIcon />;
  else return <div>{chain}</div>;
};

const WalletListContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  .label {
    font-size: 18px;
    svg {
      display: inline-block;
      margin-left: 6px;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .wallet-list {
    height: 100px;
    overflow: auto;
    min-width: 200px;
  }
  .wallet-item {
    background-color: rgba(0, 0, 0, 0.1);
    margin-bottom: 4px;
    padding: 0px 6px 2px;
    border-radius: 8px;
    position: relative;
    svg {
      display: inline-block;
      width: 16px;
      margin-right: 6px;
      margin-bottom: -10px;
    }
    .minus-button {
      position: absolute;
      right: 0;
      top: 8px;
      cursor: pointer;
      svg {
        margin-bottom: -2px;
        margin-left: 6px;
      }
    }
  }
`;
