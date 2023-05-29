"use client";
import * as Contract from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "contract", init }: ModelsProps<fetch.Contract>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Contract.Unit.Admin}
      renderDashboard={Contract.Util.Stat}
      queryMap={fetch.contractQueryMap}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={(contract: DefaultOf<fetch.Contract>) => `${contract.address}`}
        >
          <Contract.Edit.General />
        </DataEditModal>
      }
      columns={["address"]}
      actions={["edit"]}
    />
  );
};
