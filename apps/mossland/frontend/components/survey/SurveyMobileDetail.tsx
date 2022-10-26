import React from "react";
import styled from "styled-components";
import { Survey } from "@platform/ui-web";
import { walletStore } from "@shared/data-access";
import { SurveyDetailBody } from "./";
import { mocSurveyStore } from "../../store/stores";

export const SurveyMobileDetail = () => {
  const wallet = walletStore.use.wallet();
  const mocSurvey = mocSurveyStore.use.mocSurvey();

  if (!mocSurvey || !wallet) return <></>;

  return (
    <SurveyDetailContainer>
      <SurveyDetailBody />
    </SurveyDetailContainer>
  );
};

const SurveyDetailContainer = styled.div`
  position: relative;
  margin-top: -2px;
  z-index: 2;
  padding: 19px;
`;
