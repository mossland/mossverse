import React, { useEffect } from "react";
import { MapEditor, Assets, Emojis, Characters } from "@decentverse/ui-web";
import { Layout } from "antd";
import styled from "styled-components";
import { gql, utils, store } from "../stores";
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
import { Surveys } from "../components";
import { cnst } from "@shared/util";
import { env } from "../env";

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
  "survey",
];

export default function Admin() {
  const me = store.shared.admin.use.me();
  const adminMenu = store.shared.admin.use.adminMenu();
  if (!me) return <AdminAuth uri={env.endpoint} />;
  return (
    <AdminLayout isWide={adminMenu === "mapEditor"}>
      <AdminMenu menus={menus} defaultMenu="mapEditor" />
      <div>
        {adminMenu === "mapEditor" && <MapEditor />}
        {adminMenu === "emoji" && <Emojis />}
        {adminMenu === "character" && <Characters />}
        {adminMenu === "admin" && <Admins />}
        {adminMenu === "contract" && <Contracts />}
        {adminMenu === "network" && <Networks networkType={env.networkType} />}
        {adminMenu === "thing" && <Things />}
        {adminMenu === "token" && <Tokens />}
        {adminMenu === "wallet" && <Wallets />}
        {adminMenu === "asset" && <Assets />}
        {adminMenu === "survey" && <Surveys />}
      </div>
    </AdminLayout>
  );
}

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
