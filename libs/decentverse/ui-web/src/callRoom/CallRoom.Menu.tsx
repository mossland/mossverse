import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as CallRoom from ".";

export const CallRoomMenu: DataMenuItem = {
  key: "callRoom",
  label: "CallRoom",
  icon: <WarningOutlined />, // ! need to be customized
  render: () => <CallRoom.List />,
};
