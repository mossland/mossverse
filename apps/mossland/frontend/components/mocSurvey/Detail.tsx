import React from "react";
import styled from "styled-components";
import { DetailHeader, DetailBody, CreateBox } from "./";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

export const Detail = () => {
  const mocSurverService = useMocSurvey();
  if (mocSurverService.isWriteMode) {
    return (
      <SurveyDetailContainer className="only-pc">
        <CreateBox />
      </SurveyDetailContainer>
    );
  }

  return (
    <SurveyDetailContainer className="only-pc">
      {!mocSurverService.mocSurvey ? (
        <></>
      ) : (
        <>
          <DetailHeader />
          <DetailBody />
        </>
      )}
    </SurveyDetailContainer>
  );
};

const SurveyDetailContainer = styled.div`
  /* padding: 22px 0; */
  padding-bottom: 650px;
  border-left: 2px solid ${(props) => props.theme.color.black};
  /* border-bottom: 3px solid ${(props) => props.theme.color.black}; */
  flex: 1;
`;
