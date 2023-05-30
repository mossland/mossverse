"use client";
import { Field, fetch, st, usePage } from "@shared/client";

interface TokenEditProps {
  tokenId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ tokenId = undefined }: TokenEditProps) => {
  const tokenForm = st.use.tokenForm();
  const { l } = usePage();
  return (
    <>
      <Field.Parent
        label={l("token.contract")}
        disabled={!!tokenForm.id}
        sliceName="contract"
        value={tokenForm.contract}
        onChange={(contract: fetch.LightContract) => st.do.setContractOnToken(contract)}
        renderOption={(contract: fetch.LightContract) => `${contract?.displayName ?? contract?.address}`}
      />
      <Field.Number
        label={l("token.tokenId")}
        disabled={!!tokenForm.id}
        value={tokenForm.tokenId}
        onChange={st.do.setTokenIdOnToken}
      />
      <Field.Text label={l("token.uri")} value={tokenForm.uri} onChange={st.do.setUriOnToken} disabled={true} />
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
        addFiles={st.do.uploadImageOnToken}
        file={tokenForm.image}
        onRemove={() => st.do.setImageOnToken(null)}
      />
    </>
  );
};
