import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Teleport from ".";

export const TeleportMenu: DataMenuItem = {
  key: "teleport",
  label: "Teleport",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Teleport.List />,
};
