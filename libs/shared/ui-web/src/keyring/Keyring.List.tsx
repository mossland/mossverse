import { st, gql, slice } from "@shared/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Keyring from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";

export const KeyringList = ({ slice = st.slice.keyring, init }: ModelsProps<slice.KeyringSlice, gql.Keyring>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Keyring.Item}
      renderDashboard={Keyring.Stat}
      queryMap={gql.keyringQueryMap}
      type="list"
      columns={["id", "name", "accountId", "phone", "verifies"]}
      actions={["remove"]}
    />
  );
};
