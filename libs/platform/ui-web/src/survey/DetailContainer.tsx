import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { types, surveyStore, userStore } from "@platform/data-access";
import { Survey, DefaultButton } from "@platform/ui-web";
import { walletStore, networkStore, keyringStore } from "@shared/data-access";

type DetailContainerProps = {
  children: ReactNode;
};

export const DetailContainer = ({ children }: DetailContainerProps) => {
  return (
    <>
      <PcDetailContainer className="only-pc">{children}</PcDetailContainer>
    </>
  );
};

const PcDetailContainer = styled.div`
  padding: 19px;
  border-left: 2px solid ${(props) => props.theme.color.black};
  border-bottom: 3px solid ${(props) => props.theme.color.black};
  flex: 1;
  .button-container {
    display: flex;
    justify-content: space-around;
    gap: 10px;
    @media screen and (max-width: 800px) {
      justify-content: center;
      gap: 18px;
    }
  }
`;
