import { Editor, Field, RecentTime, Card } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@shared/data-access";
import { Form, message } from "antd";

interface AuthProps {
  topMenu?: string;
}

export const Auth = ({ topMenu = "signin" }: AuthProps) => {
  const adminForm = st.use.adminForm();
  const { l } = useLocale();
  return (
    <div className="w-full h-screen bg-[#ddd] flex items-center justify-center">
      {topMenu === "signin" && (
        <Card title={l("main.signIn")} className="w-96">
          <Form
            name="sign in"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={() => st.do.signinAdmin()}
            onFinishFailed={(e) => message.error("signin failed")}
            autoComplete="off"
          >
            <Field.ID value={adminForm.accountId} onChange={st.do.setAccountIdOnAdmin} />
            <Field.Password value={adminForm.password} onChange={st.do.setPasswordOnAdmin} />
            <button type="submit" className="w-full btn">
              {l("main.signIn")}
            </button>
          </Form>
        </Card>
      )}
      {topMenu === "signup" && (
        <>
          <Card title={l("main.signUp")}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={st.do.createAdmin}
              onFinishFailed={(e) => message.error(l("main.signUpFailed"))}
              autoComplete="off"
            >
              <Field.ID value={adminForm.accountId} onChange={st.do.setAccountIdOnAdmin} />
              <Field.Password value={adminForm.password} onChange={st.do.setPasswordOnAdmin} />
              <button type="submit" className="w-full btn">
                {l("main.signUp")}
              </button>
            </Form>
          </Card>
          <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-link"
              onClick={() => {
                //
              }}
            >
              {l("main.signIn")} &gt;&gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface ManageAdminRoleProps {
  admin: gql.LightAdmin;
  slice?: slice.AdminSlice;
  idx?: number;
}
export const ManageAdminRole = ({ admin, slice = st.slice.admin, idx }: ManageAdminRoleProps) => {
  if (admin.roles.includes("admin"))
    return <div onClick={() => slice.do.subAdminRole(admin.id, "admin", idx)}>Remove Admin</div>;
  else return <div onClick={() => slice.do.addAdminRole(admin.id, "admin", idx)}>Add Admin</div>;
};

interface ManageSuperAdminRoleProps {
  admin: gql.LightAdmin;
  slice?: slice.AdminSlice;
  idx?: number;
}
export const ManageSuperAdminRole = ({ admin, slice = st.slice.admin, idx }: ManageSuperAdminRoleProps) => {
  if (admin.roles.includes("superAdmin"))
    return <div onClick={() => slice.do.subAdminRole(admin.id, "superAdmin", idx)}>Remove SuperAdmin</div>;
  else return <div onClick={() => slice.do.addAdminRole(admin.id, "superAdmin", idx)}>Add SuperAdmin</div>;
};
