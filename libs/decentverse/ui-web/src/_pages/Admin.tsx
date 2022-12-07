import React, { useEffect } from "react";
import { MapEditor, Assets, Emojis, Characters } from "../index";
import { Layout } from "antd";
import styled from "styled-components";
import { store, gql } from "@decentverse/data-access";
import {
  AdminAuth,
  AdminLayout,
  AdminMenu,
  AdminMenuKey,
  Admins,
  Contracts,
  Networks,
  Things,
  Tokens,
  Wallets,
} from "@shared/ui-web";
import { cnst } from "@shared/util";
const { Sider, Content } = Layout;
export interface MapEditorProps {
  uri: string;
  networkType: cnst.NetworkType;
}

const menus: AdminMenuKey[] = [
  "mapEditor",
  "emoji",
  "character",
  "asset",
  "admin",
  "contract",
  "network",
  "thing",
  "token",
  "wallet",
];

export const Admin = ({ uri, networkType }: MapEditorProps) => {
  const me = store.shared.admin.use.me();
  const adminMenu = store.shared.admin.use.adminMenu();
  if (!me) return <AdminAuth uri={uri} />;
  return (
    <AdminLayout isWide={adminMenu === "mapEditor"}>
      <AdminMenu menus={menus} defaultMenu="mapEditor" />
      <div>
        {adminMenu === "mapEditor" && <MapEditor />}
        {adminMenu === "emoji" && <Emojis />}
        {adminMenu === "character" && <Characters characterSlice={store.character.slice.character} />}
        {adminMenu === "admin" && <Admins adminSlice={store.shared.admin.slice.admin} />}
        {adminMenu === "contract" && (
          <Contracts
            networkSlice={store.shared.network.slice.network}
            contractSlice={store.shared.contract.slice.contract}
          />
        )}
        {adminMenu === "network" && (
          <Networks networkSlice={store.shared.network.slice.network} networkType={networkType} />
        )}
        {adminMenu === "thing" && <Things thingSlice={store.shared.thing.slice.thing} />}
        {adminMenu === "token" && (
          <Tokens contractSlice={store.shared.contract.slice.contract} tokenSlice={store.shared.token.slice.token} />
        )}
        {adminMenu === "wallet" && <Wallets walletSlice={store.shared.wallet.slice.wallet} />}
        {adminMenu === "asset" && <Assets assetSlice={store.asset.slice.asset} />}
      </div>
    </AdminLayout>
  );
};

const MapEditorLayout = styled(Layout)`
  height: 100vh;
`;

const StyledSider = styled(Sider)`
  background-color: #ddd;
  min-width: 310px !important;
  max-width: 310px !important;
  width: 310px !important;
  height: 100vh;
  z-index: 3;
`;
