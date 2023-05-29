"use client";
import * as AdminComponent from "./_client";
import { DataItem, Link, fetch } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  sliceName = "admin",
  admin,
  actions,
  columns,
}: ModelProps<"admin", fetch.LightAdmin>) => {
  return (
    <DataItem
      className={className}
      title={`${admin.accountId}`}
      model={admin}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

export const General = ({ admin, href }: ModelProps<"admin", fetch.LightAdmin>) => {
  return (
    <Link href={href} className="border shadow hover:opacity-50 cursor-pointer">
      <div>{admin.id}</div>
      <div>{admin.accountId}</div>
      <div>{admin.status}</div>
      <AdminComponent.Util.ManageAdminRole id={admin.id} roles={admin.roles} />
    </Link>
  );
};
