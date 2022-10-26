import { adminStore } from "@shared/data-access";
import { Button, Card } from "antd";
import styled from "styled-components";

export const AdminInfo = () => {
  const admin = adminStore.use.admin();
  const signout = adminStore.use.signout();
  if (!admin) throw new Error("Null Admin");
  return (
    <AdminInfoContainer>
      <Card title={admin.accountId} size="small">
        <div>{admin.email}</div>
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
