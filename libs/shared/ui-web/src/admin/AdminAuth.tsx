import { useEffect, useRef, useState } from "react";
import { store, gql } from "@shared/data-access";
import styled from "styled-components";
import { AdminSignIn, AdminSignUp, AdminInfo } from "./index";

interface Props {
  uri: string;
}

export const AdminAuth = ({ uri }: Props) => {
  const viewMode = store.admin.use.viewMode();
  return (
    <AdminAuthContainer>
      <div>
        {viewMode === "signin" && <AdminSignIn />}
        {viewMode === "signup" && <AdminSignUp />}
        {viewMode === "info" && <AdminInfo />}
      </div>
    </AdminAuthContainer>
  );
};

const AdminAuthContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 800px) {
    width: 100%;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  .body {
    width: 500px;
    height: fit-content;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.4);
  }
`;
