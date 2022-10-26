import React from "react";
import styled from "styled-components";
import { Survey } from "@platform/ui-web";
import { walletStore } from "@shared/data-access";
import { SurveyDetailBody, SurveyCreate } from "./";
import { userStore } from "@platform/data-access";
import { utils } from "apps/mossland/frontend";
import { mocSurveyStore } from "apps/mossland/frontend/stores";

export const SurveyDetail = () => {
  const self = userStore.use.self();
  const mocSurvey = mocSurveyStore.use.mocSurvey();
  const mocSurveys = mocSurveyStore.use.mocSurveys();
  const isWriteMode = mocSurveyStore.use.isWriteMode();

  if (isWriteMode) {
    return (
      <SurveyDetailContainer className="only-pc">
        <SurveyCreate />
      </SurveyDetailContainer>
    );
  }

  return (
    <SurveyDetailContainer className="only-pc">
      {!mocSurvey ? (
        <></>
      ) : (
        <>
          <Survey.DetailHeader
            title={mocSurvey.title}
            status={mocSurvey.status}
            openAt={mocSurvey.openAt}
            closeAt={mocSurvey.closeAt}
            voted={utils.isVoted(mocSurveys, mocSurvey.id, self?.id)}
          />
          <SurveyDetailBody />
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
