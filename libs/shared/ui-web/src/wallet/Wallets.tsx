import { st, gql, slice } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import { CreditCardOutlined } from "@ant-design/icons";

export const WalletMenuItem: DataMenuItem = {
  key: "wallet",
  label: "Wallet",
  icon: <CreditCardOutlined />,
  render: () => <Wallets />,
};
export const Wallets = ({ slice = st.slice.wallet, init }: ModelsProps<slice.WalletSlice, gql.Wallet>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      // edit={<WalletEdit slice={slice} />}
      renderItem={Wallet}
      columns={["email"]}
      actions={["edit"]}
    />
  );
};
export const Wallet = ({
  wallet,
  slice = st.slice.wallet,
  actions,
  columns,
}: ModelProps<slice.WalletSlice, gql.LightWallet>) => {
  return <DataItem title={wallet.address} model={wallet} slice={slice} actions={actions} columns={columns} />;
};
