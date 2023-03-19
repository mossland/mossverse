import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Trade from ".";

export const TradeMenu: DataMenuItem = {
  key: "trade",
  label: "Trade",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Trade.List />,
};
