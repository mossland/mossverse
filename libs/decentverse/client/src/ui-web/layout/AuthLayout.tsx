import React from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* background-image: linear-gradient(to bottom, rgba(200,255,220,0.3), rgba(200,255,255,0.3)), url(/back.jpg);  */
  background-image: url(/back.jpg);
  background-size: cover;
  background-position: top;
`;

const Box = styled.div`
  padding: 10px;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.4);
  opacity: 0.95;
  padding: 35px 70px;
  button {
    margin-top: 2rem !important;
    width: 100%;
  }
  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
  a {
    margin-top: 1rem !important;
    display: block;
    float: right;
  }
`;

export const AuthLayout = ({ children }: { children?: JSX.Element[] | JSX.Element }) => {
  return (
    <AppContainer>
      <Box>{children}</Box>
    </AppContainer>
  );
};
