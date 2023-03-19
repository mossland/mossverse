import { QqOutlined, WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Character from ".";

export const CharacterMenu: DataMenuItem = {
  key: "character",
  label: "Character",
  icon: <QqOutlined />,
  render: () => <Character.List />,
};
