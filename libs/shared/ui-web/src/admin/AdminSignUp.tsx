import { store, gql } from "@shared/data-access";
import { Button, Form, Input, Card } from "antd";
import { toast } from "react-toastify";
import { Field } from "@shared/ui-web";
export const AdminSignUp = () => {
  const createAdmin = store.admin.use.createAdmin();
  const accountId = store.admin.use.accountId();
  const password = store.admin.use.password();
  const email = store.admin.use.email();
  return (
    <>
      <Card title="Sign Up" size="small">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={createAdmin}
          onFinishFailed={(e) => toast.error(e)}
          autoComplete="off"
        >
          <Field.ID value={accountId} onChange={(accountId) => store.admin.setState({ accountId })} />
          <Field.Email value={email} onChange={(email) => store.admin.setState({ email })} />
          <Field.Password value={password} onChange={(password) => store.admin.setState({ password })} />
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={() => store.admin.setState({ viewMode: "signin" })}>
          Sign In &gt;&gt;
        </Button>
      </div>
    </>
  );
};
