import { DataColumn, Utils } from "@util/client";
import { RecentTime } from "@shared/client";
import { twMerge } from "tailwind-merge";

export const convToAntdColumn = (column: DataColumn<any>) => {
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

export const StatusTag = ({ status, className }: { status: string; className?: string }) => (
  <div className={twMerge(`p-3 mr-1 badge ${statusColors[status] ?? "badge-outline"}`, className)}>{status}</div>
);
export const RoleTags = ({ role }: { role: string | string[] }) => {
  return Array.isArray(role) ? (
    <>
      {role.map((role) => (
        <div className={`mr-1 badge ${roleColors[role]}`} key={role}>
          {role}
        </div>
      ))}
    </>
  ) : (
    <div className="mr-1 badge" style={{ backgroundColor: roleColors[role] }}>
      {role}
    </div>
  );
};

export const statusColors = {
  active: "badge-info badge-outline",
  applied: "badge-warning",
  approved: "badge-success",
  denied: "badge-error badge-outline",
  failed: "badge-error badge-outline",
  restricted: "badge-error",
  paused: "badge-outline",
  running: "badge-warning badge-outline",
  break: "badge-accent badge-outline",
  rejected: "badge-error badge-outline",
  hidden: "badge-outline",
  inProgress: "badge-accent",
  resolved: "badge-success badge-outline",
  finished: "badge-secondary",
  inactive: "bg-gray-500 text-white",
};
export const roleColors = {
  user: "badge-success",
  business: "badge-warning",
  admin: "badge-error badge-outline",
  superAdmin: "badge-error",
  root: "badge-primary",
};
