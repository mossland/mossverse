import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Ownership from ".";

export const OwnershipMenu: DataMenuItem = {
  key: "ownership",
  label: "Ownership",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Ownership.List />,
};
