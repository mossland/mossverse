import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Webview from ".";

export const WebviewMenu: DataMenuItem = {
  key: "webview",
  label: "Webview",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <Webview.List />,
};
