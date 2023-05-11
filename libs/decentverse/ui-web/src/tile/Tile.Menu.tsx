import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Tile from ".";

export const TileMenu: DataMenuItem = {
  key: "tile",
  label: "Tile",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Tile.List />,
};
