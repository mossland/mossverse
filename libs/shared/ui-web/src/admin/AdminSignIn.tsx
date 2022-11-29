import { store, gql } from "@shared/data-access";
import { Button, Form, Input, Card } from "antd";
import { toast } from "react-toastify";
import { Field } from "@shared/ui-web";

export const AdminSignIn = () => {
  const adminForm = store.admin.use.adminForm();
  const signin = store.admin.use.signin();
  return (
    <Card title="Sign In" size="small">
      <Form
        name="sign in"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={() => signin()}
        onFinishFailed={(e) => toast.error(e)}
        autoComplete="off"
      >
        <Field.ID value={adminForm.accountId} onChange={store.admin.do.setAccountIdOnAdmin} />
        <Field.Password value={adminForm.password} onChange={store.admin.do.setPasswordOnAdmin} />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
