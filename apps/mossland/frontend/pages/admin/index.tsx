import React, { useEffect } from "react";
import { Character, Map, Asset } from "@decentverse/ui-web";
import { Layout } from "antd";
import {
  Admin,
  AdminLayout,
  ContractMenuItem,
  NetworkMenuItem,
  ProductMenuItem,
  ThingMenuItem,
  TokenMenuItem,
  WalletMenuItem,
} from "@shared/ui-web";
import { Raffle, Listing } from "@platform/ui-web";
import { cnst } from "@shared/util";
import Router from "next/router";
import { env } from "@mossland/frontend/env/env";
import { st, slice } from "@mossland/frontend/stores";
import { AdvertiseMenuItem, StakePoolMenuItem } from "@mossland/frontend/components/";

export interface MapEditorProps {
  uri: string;
  networkType: cnst.NetworkType;
}

export default function Page() {
  const me = st.use.me();
  const { topMenu, subMenu } = Router.query as { topMenu?: string; subMenu?: string };
  if (!me.id?.length) return <Admin.Action.Auth topMenu={topMenu} />;
  return (
    <AdminLayout
      logo={<div className="text-white ">Mossverse</div>}
      pageMenus={[
        {
          title: "Data",
          menus: [
            TokenMenuItem,
            ProductMenuItem,
            ThingMenuItem,
            Character.Menu,
            Admin.Menu,
            ContractMenuItem,
            NetworkMenuItem,
            Listing.Menu,
            // GifticonMenuItem,
            // CyberThugMenuItem,
            TokenMenuItem,
            WalletMenuItem,
            // AssetMenuItem,
            Asset.Menu,
            AdvertiseMenuItem,
            StakePoolMenuItem,
            Character.Menu,
            Listing.Menu,
            Raffle.Menu,
          ],
        },
        { title: "Map", menus: Map.MenuEditor },
      ]}
      topMenu={topMenu}
      subMenu={subMenu}
    />
  );
}
