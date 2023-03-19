import { WarningOutlined } from "@ant-design/icons";
import { DataMenuItem } from "@shared/util-client";
import * as Listing from ".";

export const ListingMenu: DataMenuItem = {
  key: "listing",
  label: "Listing",
  icon: <WarningOutlined />,
  render: () => <Listing.List />,
};
