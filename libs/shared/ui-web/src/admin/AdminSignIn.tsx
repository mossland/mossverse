import { adminStore } from "@shared/data-access";
import { Button, Form, Input, Card } from "antd";
import { toast } from "react-toastify";
import { Field } from "@shared/ui-web";

export const AdminSignIn = () => {
  const accountId = adminStore.use.accountId();
  const password = adminStore.use.password();
  const signin = adminStore.use.signin();
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
        <Field.ID value={accountId} onChange={(accountId) => adminStore.setState({ accountId })} />
        <Field.Password value={password} onChange={(password) => adminStore.setState({ password })} />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
