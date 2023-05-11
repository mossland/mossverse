import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Receipt from ".";

export const ReceiptMenu: DataMenuItem = {
  key: "receipt",
  label: "Receipt",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Receipt.List />,
};
