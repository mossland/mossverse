"use client";
import * as Thing from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "thing", init }: ModelsProps<fetch.Thing>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Thing.Unit.Admin}
      renderDashboard={Thing.Util.Stat}
      queryMap={fetch.thingQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(thing: DefaultOf<fetch.Thing>) => `${thing.name}`}>
          <Thing.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["purpose", "description"]}
      actions={["edit"]}
    />
  );
};
