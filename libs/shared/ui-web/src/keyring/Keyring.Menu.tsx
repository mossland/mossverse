import { DollarOutlined, WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Keyring from ".";

export const KeyringMenu: DataMenuItem = {
  key: "keyring",
  label: "Keyring",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <DollarOutlined />,
};
