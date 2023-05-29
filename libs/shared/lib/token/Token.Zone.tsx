"use client";
import * as Token from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "token", init }: ModelsProps<fetch.Token>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Token.Unit.Admin}
      renderDashboard={Token.Util.Stat}
      queryMap={fetch.tokenQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(token: DefaultOf<fetch.Token>) => `${token.tokenId}`}>
          <Token.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["tokenId"]}
      actions={["edit"]}
    />
  );
};
