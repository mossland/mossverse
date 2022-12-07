import { useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { store, gql } from "@decentverse/data-access";
import { toast } from "react-toastify";

import { ModalContainer } from "@shared/ui-web";

export const WalletModal = () => {
  const walletModal = store.shared.wallet.use.walletModal();
  const walletList = store.shared.wallet.use.walletList();
  const activeWallets = store.shared.wallet.use.activeWallets();
  const newWalletOperation = store.shared.wallet.use.newWalletOperation();
  const newAddress = store.shared.wallet.use.newAddress();
  const removeWallet = store.shared.wallet.use.removeWallet();
  const errorMsg = store.shared.wallet.use.errorMsg();
  const deleteKeyringId = store.shared.wallet.use.deleteKeyringId();
  const deleteWalletId = store.shared.wallet.use.deleteWalletId();
  const addWallet = store.shared.wallet.use.addWallet();
  const newActiveProvider = store.shared.wallet.use.newActiveProvider();
  const keyringHasWallet = store.shared.wallet.use.keyringHasWallet();
  const networkList = store.shared.network.use.networkList();
  const sign = store.shared.keyring.use.sign();

  const self = store.user.use.self();

  // 모달 닫기
  const closeWallet = () => {
    store.shared.wallet.setState({ walletModal: null, errorMsg: "" });
  };

  // 지갑 추가 수행
  const onClickAddWallet = async () => {
    try {
      if (!self?.keyring?.id) return;
      if (await checkIsNeedDelete())
        return store.shared.wallet.setState({ newWalletOperation: "needDelete", errorMsg: "" });
      const keyring = await addWallet(self.keyring.id);
      keyring && store.user.setState({ keyring });
      store.shared.keyring.setState({ walletModal: null });
      store.shared.wallet.setState({ errorMsg: "" });
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  // 네트워크ID 획득
  const getNetworkId = () => {
    const newNetworkId = networkList.find((network) => network.provider === newActiveProvider)?.id;
    store.shared.wallet.setState({ newNetworkId });
  };

  // 기존 추가 여부 확인
  const checkIsRegistered = () => walletList.find((cur) => cur.address === newAddress);

  // 다른 계정에 포함 여부 확인
  const checkIsNeedDelete = async () => {
    await sign(newActiveProvider);
    return await keyringHasWallet();
  };

  // newAddress 변경에 따른 상태 지정
  const checkNewAddress = async () => {
    getNetworkId();
    if (checkIsRegistered()) return store.shared.wallet.setState({ newWalletOperation: "registered", errorMsg: "" });
    store.shared.wallet.setState({ newWalletOperation: "idle", errorMsg: "" });
  };

  const setNewAddress = () => {
    const address = newActiveProvider === "ethereum" ? window.ethereum.selectedAddress : window.klaytn.selectedAddress;
    store.shared.wallet.setState({ newAddress: address });
  };

  useEffect(() => {
    if (!walletModal) return;
    setNewAddress();
    if (newAddress) checkNewAddress();
  }, [walletModal, newAddress]);

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

  if (walletList === "loading") return <></>;

  return (
    <ModalContainer
      showModal={!!walletModal}
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
          {errorMsg && <div className="error-message">{errorMsg}</div>}
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
