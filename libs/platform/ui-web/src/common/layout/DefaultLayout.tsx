import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import theme from "../../styles/theme";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <DefaultLayoutContainer>
        {/* {children} */}
        <div className="container">{children}</div>
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
      </DefaultLayoutContainer>
    </ThemeProvider>
  );
};

const DefaultLayoutContainer = styled.div`
  /* background-color: ${(props) => props.theme.color.gray}; */
  .container {
    position: relative;
    overflow-y: hidden;
    margin-left: auto;
    margin-right: auto;
    padding-right: 0px;
    padding-left: 0px;
  }
  @media (min-width: 476px) {
    .container {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
  @media (min-width: 768px) {
    .container {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
  @media (min-width: 992px) {
    .container {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
  @media (min-width: 1200px) {
    .container {
      padding-right: 15px;
      padding-left: 15px;
    }
  }
  @media (min-width: 476px) {
    .container {
      width: 100%;
    }
  }
  @media (min-width: 768px) {
    .container {
      width: 720px;
      max-width: 100%;
    }
  }
  @media (min-width: 992px) {
    .container {
      width: 960px;
      max-width: 100%;
    }
  }
  @media (min-width: 1200px) {
    .container {
      width: 1140px;
      max-width: 100%;
    }
  }
  @media (min-width: 1400px) {
    .container {
      width: 1340px;
      max-width: 100%;
    }
  }
`;
