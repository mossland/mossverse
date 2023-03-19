import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Raffle from ".";

export const RaffleMenu: DataMenuItem = {
  key: "raffle",
  label: "Raffle",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Raffle.List />,
};
