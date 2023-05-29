"use client";
import * as Currency from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "currency", init }: ModelsProps<fetch.Currency>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Currency.Unit.Admin}
      renderDashboard={Currency.Util.Stat}
      queryMap={fetch.currencyQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(currency: DefaultOf<fetch.Currency>) => `${currency.name}`}>
          <Currency.Edit.General />
        </DataEditModal>
      }
      columns={["type", "symbol"]}
      actions={["edit"]}
    />
  );
};
