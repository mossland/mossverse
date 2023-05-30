"use client";
import { Field, fetch, st, usePage } from "@shared/client";

interface ContractEditProps {
  contractId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ contractId = undefined }: ContractEditProps) => {
  const contractForm = st.use.contractForm();
  const { l } = usePage();
  return (
    <>
      <Field.Parent
        label={l("contract.network")}
        sliceName="network"
        value={contractForm.network}
        onChange={(network: fetch.Network) => st.do.setNetworkOnContract(network)}
        renderOption={(network: fetch.Network) => `${network.name}/${network.provider}/${network.type}`}
      />
      <Field.Text
        label={l("contract.address")}
        value={contractForm.address}
        onChange={st.do.setAddressOnContract}
        disabled={!!contractForm.id}
      />
      <Field.Text
        label={l("contract.name")}
        value={contractForm.displayName}
        onChange={st.do.setDisplayNameOnContract}
      />
    </>
  );
};
