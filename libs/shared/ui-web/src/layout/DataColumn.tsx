import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Utils } from "@shared/util";
import { DataAction, DataColumn, SliceModel } from "@shared/util-client";
import { Popconfirm, TableColumnType, Tag } from "antd";
import { RecentTime } from "../Recent";

export const convToAntdColumn = (column: DataColumn<any>): TableColumnType<any> => {
  if (typeof column !== "string")
    return {
      key: column.key as string,
      dataIndex: column.key as string,
      title: Utils.capitalize(column.key as string),
      responsive: column.responsive ? (["xs", "sm", "md", "xl"] as any) : undefined,
      render: column.render,
    };
  else if (["createdAt", "updatedAt", "at", "lastLoginAt", "openAt", "closeAt"].includes(column))
    return {
      key: column,
      dataIndex: column,
      title: Utils.capitalize(column),
      render: (date) => <RecentTime date={date} />,
    };
  else if (column.includes("status") || column.includes("Status"))
    return {
      key: column,
      dataIndex: column,
      title: Utils.capitalize(column),
      render: (status) => <StatusTag status={status} />,
    };
  else if (column.includes("role") || column.includes("Role"))
    return {
      key: column,
      dataIndex: column,
      title: Utils.capitalize(column),
      render: (r) => <RoleTags role={r} />,
    };
  else return { key: column, dataIndex: column, title: Utils.capitalize(column) };
};

export const StatusTag = ({ status }: { status: string }) => <Tag color={statusColors[status]}>{status}</Tag>;
export const RoleTags = ({ role }: { role: string | string[] }) => {
  return Array.isArray(role) ? (
    <>
      {role.map((role) => (
        <Tag key={role} color={roleColors[role]}>
          {role}
        </Tag>
      ))}
    </>
  ) : (
    <Tag color={roleColors[role]}>{role}</Tag>
  );
};

export const statusColors = {
  active: "green",
  applied: "gold",
  approved: "lime",
  denied: "magenta",
  restricted: "red",
  paused: "pink",
  running: "green",
  break: "gold",
  rejected: "red",
  hidden: "black",
  inProgress: "gold",
  resolved: "blue",
  finished: "purple",
  inactive: "gray",
};
export const roleColors = {
  user: "geekblue",
  business: "orange",
  admin: "volcano",
  superAdmin: "cyan",
  root: "black",
};
