import { MonitorOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Admin from ".";

export const AdminMenu: DataMenuItem = {
  key: "admin",
  label: "Admin",
  icon: <MonitorOutlined />,
  render: () => <Admin.List />,
};
