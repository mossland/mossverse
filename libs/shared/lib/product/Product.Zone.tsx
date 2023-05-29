"use client";
import * as Product from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "product", init }: ModelsProps<fetch.Product>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Product.Unit.Admin}
      renderDashboard={Product.Util.Stat}
      queryMap={fetch.productQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(product: DefaultOf<fetch.Product>) => `${product.name}`}>
          <Product.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["purpose", "description"]}
      actions={["edit"]}
    />
  );
};
