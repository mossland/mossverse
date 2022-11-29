import React from "react";
import styled from "styled-components";
import { Survey } from "@platform/ui-web";
import { DetailBody } from ".";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

export const DetailMobile = () => {
  const mocSurveyService = useMocSurvey();
  if (!mocSurveyService.mocSurvey) return <></>;

  return (
    <SurveyDetailContainer>
      <DetailBody />
    </SurveyDetailContainer>
  );
};

const SurveyDetailContainer = styled.div`
  position: relative;
  margin-top: -2px;
  z-index: 2;
  padding: 19px;
`;
