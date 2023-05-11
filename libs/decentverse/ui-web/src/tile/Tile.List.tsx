import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, DataListContainer, DataTableList, LoadItems } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Tile from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { useEffect } from "react";

export const TileList = ({ slice = st.slice.tile, init }: ModelsProps<slice.TileSlice, gql.Tile>) => {
  return (
    <LoadItems
      slice={slice}
      init={init}
      renderItem={(tile: gql.LightTile, idx) => <Tile.Item slice={slice} tile={tile} idx={idx} />}
    />
  );
};

const TileListWorld = ({ slice = st.slice.tile, init }: ModelsProps<slice.TileSlice, gql.Tile>) => {
  return (
    <LoadItems
      noDiv
      slice={slice}
      init={init}
      loading={<></>}
      renderItem={(tile: gql.LightTile, idx) => <Tile.Item.World key={tile.id} slice={slice} tile={tile} idx={idx} />}
    />
  );
};
TileList.World = TileListWorld;
