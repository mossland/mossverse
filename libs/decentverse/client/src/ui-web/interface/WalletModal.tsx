import { useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { walletStore, networkStore, keyringStore, utils } from "@shared/data-access";
import { userStore } from "../../stores";
import { toast } from "react-toastify";

import { ModalContainer } from "@shared/ui-web";

export const WalletModal = () => {
  const isOpenModal = walletStore.use.modalOpen();
  const wallets = walletStore.use.wallets();
  const activeWallets = walletStore.use.activeWallets();
  const newWalletOperation = walletStore.use.newWalletOperation();
  const newAddress = walletStore.use.newAddress();
  const removeWallet = walletStore.use.removeWallet();
  const errorMeg = walletStore.use.errorMeg();
  const deleteKeyringId = walletStore.use.deleteKeyringId();
  const deleteWalletId = walletStore.use.deleteWalletId();
  const addWallet = walletStore.use.addWallet();
  const newActiveProvider = walletStore.use.newActiveProvider();
  const keyringHasWallet = walletStore.use.keyringHasWallet();
  const networks = networkStore.use.networks();
  const sign = keyringStore.use.sign();

  const self = userStore.use.self();

  // 모달 닫기
  const closeWallet = () => {
    walletStore.setState({ modalOpen: false, errorMeg: "" });
  };

  // 지갑 추가 수행
  const onClickAddWallet = async () => {
    try {
      if (!self?.keyring?.id) return;
      if (await checkIsNeedDelete()) return walletStore.setState({ newWalletOperation: "needDelete", errorMeg: "" });
      const keyring = await addWallet(self.keyring.id);
      keyring && userStore.setState({ keyring });
      keyringStore.setState({ isOpenModal: false });
      walletStore.setState({ errorMeg: "" });
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  // 네트워크ID 획득
  const getNetworkId = () => {
    const newNetworkId = networks.find((network) => network.provider === newActiveProvider)?.id;
    walletStore.setState({ newNetworkId });
  };

  // 기존 추가 여부 확인
  const checkIsRegistered = () => wallets.find((cur) => cur.address === newAddress);

  // 다른 계정에 포함 여부 확인
  const checkIsNeedDelete = async () => {
    await sign(newActiveProvider);
    return await keyringHasWallet();
  };

  // newAddress 변경에 따른 상태 지정
  const checkNewAddress = async () => {
    getNetworkId();
    if (checkIsRegistered()) return walletStore.setState({ newWalletOperation: "registered", errorMeg: "" });
    walletStore.setState({ newWalletOperation: "idle", errorMeg: "" });
  };

  const setNewAddress = () => {
    const address = newActiveProvider === "ethereum" ? window.ethereum.selectedAddress : window.klaytn.selectedAddress;
    walletStore.setState({ newAddress: address });
  };

  useEffect(() => {
    if (!isOpenModal) return;
    setNewAddress();
    if (newAddress) checkNewAddress();
  }, [isOpenModal, newAddress]);

  // useEffect(() => {
  //   console.log("newAddress", newAddress);
  //   if (!newAddress) return;
  //   checkNewAddress();
  // }, [newAddress]);

  const getAddress = () => {
    if (newAddress) return newAddress;
    const currentWallet = activeWallets.find((cur) => cur.network.provider === newActiveProvider);
    if (currentWallet) return currentWallet.address;
    return "None";
  };

  return (
    <ModalContainer
      showModal={isOpenModal}
      closeShowModal={closeWallet}
      title={`Add ${newActiveProvider.replace(/^[a-z]/, (char) => char.toUpperCase())} Wallet`}
      opacity="0.9"
    >
      <WalletModalContainer>
        <div className="body">
          <div className="address">
            <div className="label">adddres:</div>
            {getAddress()}
          </div>
          {newWalletOperation === "sleep" && (
            <div className="message">
              {newActiveProvider === "klaytn" ? "카이카스" : "메타마스크"}에서 지갑주소를 변경해주세요.
            </div>
          )}
          {newWalletOperation === "registered" && <div className="message">이미 추가된 지갑주소입니다.</div>}
          {newWalletOperation === "needDelete" && (
            <div className="message">
              선택한 지갑주소와 연결된 계정이 있습니다.
              <br /> 삭제하고 계속하시겠습니까?
            </div>
          )}
          {errorMeg && <div className="error-message">{errorMeg}</div>}
        </div>
        {newWalletOperation === "idle" && (
          <div className={`add-button ${newWalletOperation !== "idle" && "disabled"}`} onClick={onClickAddWallet}>
            Add Wallet
          </div>
        )}
        {newWalletOperation === "needDelete" && (
          <div className={`add-button`} onClick={() => removeWallet(deleteKeyringId, deleteWalletId, newAddress)}>
            Remove Wallet
          </div>
        )}
      </WalletModalContainer>
    </ModalContainer>
  );
};

const WalletModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 258px;
  justify-content: space-between;
  .body {
    .address {
      padding: 10px;
      border-radius: 10px;
      background-color: #ddd;
      .label {
        font-weight: 700;
      }
    }
    .message {
      text-align: center;
      margin: 10px 0;
    }
    .error-message {
      text-align: center;
      margin: 10px 0;
      font-size: 14px;
      color: #f66;
    }
  }

  .add-button {
    border: 1px solid #000;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
    transition: all 0.5s;
    width: 100%;
    text-align: center;
    &:hover,
    &:active {
      background-color: ${(props) => darken(0.1, "#fff")};
    }
    &.disabled {
      cursor: not-allowed;
      background-color: ${(props) => darken(0.2, "#fff")};
      border-color: #ddd;
      color: #888;
    }
  }
`;
