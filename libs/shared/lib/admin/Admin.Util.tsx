"use client";
import * as Admin from "./_client";
import { AiOutlineMonitor } from "react-icons/ai";
import { DataDashboard, Field, fetch, st, usePage } from "@shared/client";
import { DataMenuItem, ModelDashboardProps, cnst } from "@util/client";
import { ReactNode } from "react";

export const Menu: DataMenuItem = {
  key: "admin",
  label: "Admin",
  icon: <AiOutlineMonitor />,
  render: () => <Admin.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "admin",
  queryMap = fetch.adminQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.AdminSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalAdmin"]}
      hidePresents={hidePresents}
    />
  );
};

interface AuthProps {
  logo?: ReactNode;
}
export const Auth = ({ logo }: AuthProps) => {
  const adminForm = st.use.adminForm();
  const { l } = usePage();
  return (
    <div className="w-full h-screen bg-[#ddd] flex items-center justify-center">
      <div className="flex flex-col gap-4 p-8 bg-white border border-gray-300 w-96 rounded-2xl shadowa">
        <div className="grid w-full place-items-center">Admin System</div>
        <div className="grid w-full place-items-center">{logo} </div>
        <div className="flex justify-center w-full gap-1">
          <div className="grid w-24 place-items-center">Account: </div>
          <Field.ID value={adminForm.accountId} onChange={st.do.setAccountIdOnAdmin} />
        </div>
        <div className="flex justify-center w-full gap-1">
          <div className="grid w-24 place-items-center">Password: </div>
          <Field.Password value={adminForm.password} onChange={st.do.setPasswordOnAdmin} />
        </div>
        <button
          className="w-full btn"
          onKeyDown={(e) => e.key === "Enter" && st.do.signinAdmin()}
          onClick={() => st.do.signinAdmin()}
        >
          {l("shared.signIn")}
        </button>
      </div>
    </div>
  );
};

interface ManageAdminRoleProps {
  id: string;
  roles: cnst.AdminRole[];
}
export const ManageAdminRole = ({ id, roles }: ManageAdminRoleProps) => {
  if (roles.includes("admin")) return <div onClick={() => st.do.subAdminRole(id, "admin")}>Remove Admin</div>;
  else return <div onClick={() => st.do.addAdminRole(id, "admin")}>Add Admin</div>;
};

interface ManageSuperAdminRoleProps {
  id: string;
  roles: cnst.AdminRole[];
}
export const ManageSuperAdminRole = ({ id, roles }: ManageSuperAdminRoleProps) => {
  if (roles.includes("superAdmin"))
    return <div onClick={() => st.do.subAdminRole(id, "superAdmin")}>Remove SuperAdmin</div>;
  else return <div onClick={() => st.do.addAdminRole(id, "superAdmin")}>Add SuperAdmin</div>;
};
