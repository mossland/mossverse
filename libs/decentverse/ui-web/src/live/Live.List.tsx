import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Live from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";

export const LiveList = ({ slice = st.slice.live, init }: ModelsProps<slice.LiveSlice, gql.Live>) => {
  return (
    <LoadItems
      slice={slice}
      init={init}
      renderItem={(live: gql.LightLive, idx) => <Live.Item slice={slice} live={live} idx={idx} />}
    />
  );
};

const LiveListWorld = ({ slice = st.slice.live, init }: ModelsProps<slice.LiveSlice, gql.Live>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={null}
      renderItem={(live: gql.LightLive, idx) => <Live.Item.World key={live.id} slice={slice} live={live} idx={idx} />}
    />
  );
};

LiveList.World = LiveListWorld;
