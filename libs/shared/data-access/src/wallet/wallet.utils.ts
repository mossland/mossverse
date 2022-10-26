import { types } from "..";

export const checkWalletIncluded = (wallets: types.Wallet[], newAddress: string) => {
  return !!wallets.find((cur) => cur.address === newAddress);
};

// export const checkWalletChange = async (wallets: types.Wallet[], networkId: string, modalOpen: boolean) => {
//   //! metamask 추가
//   window.klaytn.on("accountsChanged", async ([newAddress]: string[]) => {
//     console.log("accountsChanged", newAddress);
//     console.log("networkId", networkId);
//     const sign = keyringStore.use.sign();
//     await sign("klaytn");

//     // const signKaikas = keyringStore.use.signKaikas();
//     // await signKaikas();

//     const isNeedDelete = await gql.keyringHasWallet(networkId);
//     console.log("isNeedDelete!!", isNeedDelete);
//     // const { modalOpen, wallets } = get();
//     if (modalOpen) {
//       // 새 wallet 주소 추가시
//       if (checkWalletIncluded(wallets, newAddress)) {
//         // 해당 계정에 이미 추가된 address
//         walletStore.setState({ newWalletOperation: "registered", newAddress });
//         // set({ newWalletOperation: "registered", newAddress });
//       } else if (checkNeedDelete()) {
//         // !todo: 다른 계정에 연결된 address
//         walletStore.setState({ newWalletOperation: "needDelete", newAddress });
//         // set({ newWalletOperation: "needDelete", newAddress });
//       } else {
//         // address 추가 가능
//         walletStore.setState({ newWalletOperation: "idle", newAddress });
//         // set({ newWalletOperation: "idle", newAddress });
//       }
//     } else {
//       // 등록된 유저의 경우 전환
//       //! todo
//       // 로그아웃
//       //! todo
//     }
//   });
// };
