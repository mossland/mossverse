import React, { useEffect, ReactNode } from "react";
import styled from "styled-components";
import { Detail, List } from "./";

export const Body = () => {
  return (
    <BodyContainer>
      <List />
      <Detail />
    </BodyContainer>
  );
};

const BodyContainer = styled.div`
  height: calc(100vh - 107px);
  display: flex;
  border-top: 2px solid ${(props) => props.theme.color.black};
  overflow-y: auto;
`;
