"use client";
import { Field, st, usePage } from "@shared/client";
import { cnst } from "@util/client";

interface NetworkEditProps {
  networkId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ networkId = undefined }: NetworkEditProps) => {
  const networkForm = st.use.networkForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label={l("network.name")} value={networkForm.name} onChange={st.do.setNameOnNetwork} />
      <Field.SelectItem
        label={l("network.provider")}
        items={cnst.networkProviders}
        value={networkForm.provider}
        onChange={st.do.setProviderOnNetwork}
        disabled={!!networkForm.id}
      />
      <Field.SelectItem
        label={l("network.type")}
        items={cnst.networkTypes}
        value={networkForm.type}
        onChange={st.do.setTypeOnNetwork}
      />
      <Field.Number
        label={l("network.networkId")}
        value={networkForm.networkId}
        onChange={st.do.setNetworkIdOnNetwork}
      />
      <Field.Text
        label={l("network.endPoint")}
        value={networkForm.endPoint}
        onChange={st.do.setEndPointOnNetwork}
        disabled={!!networkForm.id}
      />
    </>
  );
};
