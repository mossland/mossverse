import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Collision from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";

export const CollisionList = ({
  slice = st.slice.collision,
  init,
}: ModelsProps<slice.CollisionSlice, gql.Collision>) => {
  return (
    <LoadItems
      slice={slice}
      init={init}
      renderItem={(collision: gql.LightCollision, idx) => (
        <Collision.Item slice={slice} collision={collision} idx={idx} />
      )}
    />
  );
};

const CollisionListWorld = ({ slice = st.slice.collision, init }: ModelsProps<slice.CollisionSlice, gql.Collision>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={null}
      renderItem={(collision: gql.LightCollision, idx) => (
        <Collision.Item.World key={collision.id} slice={slice} collision={collision} idx={idx} />
      )}
    />
  );
};
CollisionList.World = CollisionListWorld;
