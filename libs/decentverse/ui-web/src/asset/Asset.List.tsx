import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Asset from ".";

export const AssetList = ({ slice = st.slice.asset, init }: ModelsProps<slice.AssetSlice, gql.Asset>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Asset.Item}
      renderDashboard={Asset.Stat}
      queryMap={gql.assetQueryMap}
      edit={
        <DataEditModal slice={slice} renderTitle={(asset: DefaultOf<gql.Asset>) => `${asset.name}`}>
          <Asset.Edit slice={slice} />
        </DataEditModal>
      }
      columns={["type", "status", "createdAt"]}
      actions={(asset: gql.LightAsset, idx) => ["remove", "edit"]}
    />
  );
};
