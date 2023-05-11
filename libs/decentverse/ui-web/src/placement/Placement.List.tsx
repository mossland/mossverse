import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Placement from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";

export const PlacementList = ({
  slice = st.slice.placement,
  init,
}: ModelsProps<slice.PlacementSlice, gql.Placement>) => {
  return (
    <LoadItems
      slice={slice}
      init={init}
      renderItem={(placement: gql.LightPlacement, idx) => (
        <Placement.Item slice={slice} placement={placement} idx={idx} />
      )}
    />
  );
};
const PlacementListWorld = ({ slice = st.slice.placement, init }: ModelsProps<slice.PlacementSlice, gql.Placement>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={null}
      renderItem={(placement: gql.LightPlacement, idx) => (
        <Placement.Item.World key={placement.id} slice={slice} placement={placement} idx={idx} />
      )}
    />
  );
};
PlacementList.World = PlacementListWorld;
