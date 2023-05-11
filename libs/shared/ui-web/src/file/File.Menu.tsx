import { FileOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as File from ".";

export const FileMenu: DataMenuItem = {
  key: "file",
  label: "File",
  icon: <FileOutlined />,
  render: () => <File.List />,
};
