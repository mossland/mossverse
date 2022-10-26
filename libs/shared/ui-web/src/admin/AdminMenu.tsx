import styled from "styled-components";
import { types, adminStore } from "@shared/data-access";
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
};

interface AdminMenuProps {
  menus: AdminMenuKey[];
  defaultMenu?: AdminMenuKey;
}

export const AdminMenu = ({ menus, defaultMenu }: AdminMenuProps) => {
  useEffect(() => {
    defaultMenu && adminStore.setState({ adminMenu: defaultMenu ?? menus[0] });
  }, []);
  const menuOpen = adminStore.use.menuOpen();
  const signout = adminStore.use.signout();
  const adminMenu = adminStore.use.adminMenu();
  return (
    <div>
      <StyledButton
        icon={<BarsOutlined />}
        type="primary"
        onClick={(e: any) => {
          adminStore.setState({ menuOpen: true });
        }}
      >
        Menu
      </StyledButton>
      <Drawer title="Menu" placement="left" onClose={() => adminStore.setState({ menuOpen: false })} open={menuOpen}>
        <Menu
          selectedKeys={[adminMenu]}
          mode="inline"
          items={menus.map((menu) => ({ label: Utils.capitalize(menu), key: menu, icon: menuIconMap[menu] }))}
          onClick={(val) => adminStore.setState({ menuOpen: false, adminMenu: val.key })}
        />
        <hr />
        <Button type="link" block onClick={signout}>
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
  svg {
    vertical-align: baseline;
  }
`;
