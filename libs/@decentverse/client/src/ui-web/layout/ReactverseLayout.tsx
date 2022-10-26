import styled from "styled-components";
import { client } from "../../stores";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer } from "react-toastify";

interface Props {
  children?: JSX.Element[] | JSX.Element;
}

export const ReactverseLayout = ({ children }: Props) => {
  return (
    <ApolloProvider client={client}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        hideProgressBar
      />
      <AppContainer>{children}</AppContainer>
    </ApolloProvider>
  );
};

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  @media screen and (max-width: 800px) {
    width: 100%;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    overscroll-behavior: none;
  }
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;
