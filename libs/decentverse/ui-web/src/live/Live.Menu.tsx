import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Live from ".";

export const LiveMenu: DataMenuItem = {
  key: "live",
  label: "Live",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Live.List />,
};
