import { gql, st, slice, useLocale } from "@shared/data-access";
import { cnst, Utils } from "@shared/util";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "../index";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";
import Image from "next/legacy/image";
import { DollarOutlined } from "@ant-design/icons";

export const CurrencyMenuItem: DataMenuItem = {
  key: "currency",
  label: "Currency",
  icon: <DollarOutlined />,
  render: () => <Currencies />,
};

export const Currencies = ({ slice = st.slice.currency, init }: ModelsProps<slice.CurrencySlice, gql.Currency>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<CurrencyEdit slice={slice} />}
      renderItem={Currency}
      columns={["type", "symbol"]}
      actions={["edit"]}
    />
  );
};
export const Currency = ({
  currency,
  slice = st.slice.currency,
  actions,
  columns,
}: ModelProps<slice.CurrencySlice, gql.LightCurrency>) => {
  return <DataItem title={currency.name} model={currency} slice={slice} actions={actions} columns={columns} />;
};

export const CurrencyEdit = ({ slice }: ModelEditProps<slice.CurrencySlice>) => {
  const currencyForm = slice.use.currencyForm();
  const { l } = useLocale();

  return (
    <DataEditModal slice={slice} renderTitle={(currency: DefaultOf<gql.Currency>) => `${currency.name}`}>
      <Field.Text label={l("currency.name")} value={currencyForm.name} onChange={slice.do.setNameOnCurrency} />
      <Field.SelectItem
        label={l("currency.symbol")}
        items={cnst.currencySymbols}
        value={currencyForm.symbol}
        onChange={slice.do.setSymbolOnCurrency}
      />
      <Field.SelectItem
        label={l("currency.type")}
        items={cnst.currencyTypes}
        value={currencyForm.type}
        onChange={slice.do.setTypeOnCurrency}
      />
      <Field.Tags
        label={l("currency.services")}
        values={currencyForm.services}
        onUpdate={slice.do.setServicesOnCurrency}
      />
    </DataEditModal>
  );
};
