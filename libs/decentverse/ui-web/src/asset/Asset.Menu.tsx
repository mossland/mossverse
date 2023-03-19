import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Asset from ".";

export const AssetMenu: DataMenuItem = {
  key: "asset",
  label: "Asset",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Asset.List />,
};
