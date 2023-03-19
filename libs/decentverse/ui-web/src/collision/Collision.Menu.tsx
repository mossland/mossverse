import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Collision from ".";

export const CollisionMenu: DataMenuItem = {
  key: "collision",
  label: "Collision",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Collision.List />,
};
