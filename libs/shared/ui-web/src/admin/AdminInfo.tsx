import { store, gql } from "@shared/data-access";
import { Button, Card } from "antd";
import styled from "styled-components";

export const AdminInfo = () => {
  const me = store.admin.use.me();
  const signout = store.admin.use.signout();
  if (!me) throw new Error("Null Admin");
  return (
    <AdminInfoContainer>
      <Card title={me.accountId} size="small">
        <div>{me.email}</div>
      </Card>
      <div style={{ textAlign: "right" }}>
        <Button type="link" onClick={signout}>
          log out
        </Button>
      </div>
    </AdminInfoContainer>
  );
};

const AdminInfoContainer = styled.div`
  width: 240px;
`;
