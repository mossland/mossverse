import styled from "styled-components";
import { Header, Footer, Container } from ".";
import { useHistory } from "react-router-dom";
import { store, gql } from "@decentverse/data-access";

interface Props {
  children?: JSX.Element[] | JSX.Element;
}

export const DefaultLayout = ({ children }: Props) => {
  const history = useHistory();
  const admin = store.shared.admin((state) => state.admin);
  const signout = store.shared.admin((state) => state.signout);
  const logout = () => {
    history.push("/login");
    signout();
  };
  return (
    <AppContainer>
      <Header logout={logout} accountName={admin?.accountId} />
      <Container style={{ marginBottom: 200 }}>
        <>{children}</>
      </Container>
      <Footer />
    </AppContainer>
  );
};

const AppContainer = styled.div`
  background: #f2f2f2;
  min-height: 100vh; /* will cover the 100% of viewport */
  overflow: hidden;
  display: block;
  position: relative;
  margin: 0 auto;
`;
