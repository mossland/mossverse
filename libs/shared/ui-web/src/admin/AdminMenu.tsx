import styled from "styled-components";
import { store, gql } from "@shared/data-access";
import { Menu, Button, Drawer } from "antd";
import type { MenuProps } from "antd";
import {
  ShopOutlined,
  DesktopOutlined,
  SettingOutlined,
  BorderOuterOutlined,
  BarsOutlined,
  FileOutlined,
  SmileOutlined,
  HomeOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { cnst, Utils } from "@shared/util";

export const adminMenuKeys = [
  "mapEditor",
  "admin",
  "network",
  "contract",
  "token",
  "thing",
  "wallet",
  "character",
  "emoji",
  "asset",
  "dialog",
  "survey",
  "video",
  "actress",
  "board",
  "story",
  "comment",
  "collect",
  "feature",
  "generative",
  "part",
  "mintEvent",
  "mintLog",
  "trade",
  "currency",
  "heartCoupon",
  "user",
] as const;
export type AdminMenuKey = typeof adminMenuKeys[number];
export const menuIconMap: { [key in AdminMenuKey]: React.ReactNode | null } = {
  mapEditor: <ShopOutlined />,
  admin: <DesktopOutlined />,
  network: <FileOutlined />,
  contract: <FileOutlined />,
  token: <FileOutlined />,
  thing: <FileOutlined />,
  wallet: <BorderOuterOutlined />,
  character: <FileOutlined />,
  emoji: <SmileOutlined />,
  asset: <HomeOutlined />,
  dialog: <SettingOutlined />,
  survey: <OrderedListOutlined />,
  video: <FileOutlined />,
  actress: <FileOutlined />,
  board: <FileOutlined />,
  story: <FileOutlined />,
  comment: <FileOutlined />,
  collect: <FileOutlined />,
  feature: <FileOutlined />,
  generative: <FileOutlined />,
  part: <FileOutlined />,
  mintEvent: <FileOutlined />,
  mintLog: <FileOutlined />,
  trade: <FileOutlined />,
  currency: <FileOutlined />,
  heartCoupon: <FileOutlined />,
  user: <FileOutlined />,
};

interface AdminMenuProps {
  menus: AdminMenuKey[];
  defaultMenu?: AdminMenuKey;
}

export const AdminMenu = ({ menus, defaultMenu }: AdminMenuProps) => {
  useEffect(() => {
    store.admin.do.setAdminMenu(defaultMenu ?? adminMenu[0]);
  }, []);
  const menuOpen = store.admin.use.menuOpen();
  const adminMenu = store.admin.use.adminMenu();
  return (
    <div>
      <StyledButton icon={<BarsOutlined />} type="primary" onClick={() => store.admin.do.setMenuOpen(true)}>
        Menu
      </StyledButton>
      <Drawer title="Menu" placement="left" onClose={() => store.admin.do.setMenuOpen(false)} open={menuOpen}>
        <Menu
          selectedKeys={[adminMenu]}
          mode="inline"
          items={menus.map((menu) => ({ label: Utils.capitalize(menu), key: menu, icon: menuIconMap[menu] }))}
          onClick={(val) => store.admin.set({ menuOpen: false, adminMenu: val.key })}
        />
        <hr />
        <Button type="link" block onClick={store.admin.do.signout}>
          Log out
        </Button>
      </Drawer>
    </div>
  );
};

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  margin-bottom: 10px;
`;
