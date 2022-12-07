import { store, gql } from "@shared/data-access";
import { Button, Form, Input, Card } from "antd";
import { toast } from "react-toastify";
import { Field } from "@shared/ui-web";
export const AdminSignUp = () => {
  const adminForm = store.admin.use.adminForm();
  return (
    <>
      <Card title="Sign Up" size="small">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={store.admin.do.createAdmin}
          onFinishFailed={(e) => toast.error(e)}
          autoComplete="off"
        >
          <Field.ID value={adminForm.accountId} onChange={store.admin.do.setAccountIdOnAdmin} />
          <Field.Email value={adminForm.email} onChange={store.admin.do.setEmailOnAdmin} />
          <Field.Password value={adminForm.password} onChange={store.admin.do.setPasswordOnAdmin} />
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={() => store.admin.do.setViewMode("signin")}>
          Sign In &gt;&gt;
        </Button>
      </div>
    </>
  );
};
