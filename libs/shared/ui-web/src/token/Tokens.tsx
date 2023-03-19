import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import Image from "next/legacy/image";
import { FileDoneOutlined } from "@ant-design/icons";

export const TokenMenuItem: DataMenuItem = {
  key: "token",
  label: "Token",
  icon: <FileDoneOutlined />,
  render: () => <Tokens />,
};

export const Tokens = ({ slice = st.slice.token, init }: ModelsProps<slice.TokenSlice, gql.LightToken>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<TokenEdit slice={slice} />}
      renderItem={Token}
      columns={["tokenId"]}
      actions={["edit"]}
    />
  );
};
export const Token = ({
  token,
  slice = st.slice.token,
  actions,
  columns,
}: ModelProps<slice.TokenSlice, gql.LightToken>) => {
  return (
    <DataItem
      title={`${token.contract.displayName ?? token.contract.address} / ${token.tokenId ?? ""}`}
      cover={token.meta?.image ? <Image src={token.meta?.image} width={512} height={512} alt="token" /> : null}
      model={token}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

export const TokenEdit = ({ slice }: ModelEditProps<slice.TokenSlice>) => {
  const tokenForm = slice.use.tokenForm();
  const { l } = useLocale();

  return (
    <DataEditModal
      slice={slice}
      renderTitle={(token: DefaultOf<gql.Token>) => `${token.contract?.name ?? token.meta?.name}`}
    >
      <Field.Parent
        label={l("token.contract")}
        disabled={!!tokenForm.id}
        slice={st.slice.contract}
        value={tokenForm.contract}
        onChange={(contract) => slice.do.setContractOnToken(contract)}
        renderOption={(contract) => `${contract?.displayName ?? contract?.address}`}
      />
      <Field.Number
        label={l("token.tokenId")}
        disabled={!!tokenForm.id}
        value={tokenForm.tokenId}
        onChange={slice.do.setTokenIdOnToken}
      />
      <Field.Text label={l("token.uri")} value={tokenForm.uri} onChange={slice.do.setUriOnToken} disabled={true} />
      <Field.Text
        label={l("token.meta")}
        value={JSON.stringify(tokenForm.meta)}
        onChange={(meta) => {
          //
        }}
        disabled={true}
      />
      <Field.Img
        label={l("token.image")}
        addFiles={slice.do.uploadImageOnToken}
        file={tokenForm.image}
        onRemove={() => slice.do.setImageOnToken(null)}
      />
    </DataEditModal>
  );
};
