"use client";
import { Field, st, usePage } from "@shared/client";
import { cnst } from "@util/client";

interface CurrencyEditProps {
  currencyId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ currencyId = undefined }: CurrencyEditProps) => {
  const currencyForm = st.use.currencyForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label={l("currency.name")} value={currencyForm.name} onChange={st.do.setNameOnCurrency} />
      <Field.SelectItem
        label={l("currency.symbol")}
        items={cnst.currencySymbols}
        value={currencyForm.symbol}
        onChange={st.do.setSymbolOnCurrency}
      />
      <Field.SelectItem
        label={l("currency.type")}
        items={cnst.currencyTypes}
        value={currencyForm.type}
        onChange={st.do.setTypeOnCurrency}
      />
      <Field.Tags
        label={l("currency.services")}
        values={currencyForm.services}
        onUpdate={st.do.setServicesOnCurrency}
      />
    </>
  );
};
