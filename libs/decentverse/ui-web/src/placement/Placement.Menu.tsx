import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Placement from ".";

export const PlacementMenu: DataMenuItem = {
  key: "placement",
  label: "Placement",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Placement.List />,
};
