import React, { ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import theme from "../../styles/theme";

type PlatformLayoutProps = {
  children: ReactNode;
};

export const PlatformLayout = ({ children }: PlatformLayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <PlatformLayoutContainer>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          hideProgressBar
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PlatformLayoutContainer>
    </ThemeProvider>
  );
};

const PlatformLayoutContainer = styled.div`
  max-width: 1340px;
  overflow-y: hidden;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  /* border: 2px solid #000; */
  position: relative;
`;
