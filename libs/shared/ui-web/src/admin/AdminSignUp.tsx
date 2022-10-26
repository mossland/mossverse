import { adminStore } from "@shared/data-access";
import { Button, Form, Input, Card } from "antd";
import { toast } from "react-toastify";
import { Field } from "@shared/ui-web";
export const AdminSignUp = () => {
  const create = adminStore.use.create();
  const accountId = adminStore.use.accountId();
  const password = adminStore.use.password();
  const email = adminStore.use.email();
  return (
    <>
      <Card title="Sign Up" size="small">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={create}
          onFinishFailed={(e) => toast.error(e)}
          autoComplete="off"
        >
          <Field.ID value={accountId} onChange={(accountId) => adminStore.setState({ accountId })} />
          <Field.Email value={email} onChange={(email) => adminStore.setState({ email })} />
          <Field.Password value={password} onChange={(password) => adminStore.setState({ password })} />
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={() => adminStore.setState({ viewMode: "signin" })}>
          Sign In &gt;&gt;
        </Button>
      </div>
    </>
  );
};
