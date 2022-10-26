import React from "react";
import styled from "styled-components";
import { userStore } from "@platform/data-access";
import { DefaultButton } from "@platform/ui-web";
import { mocSurveyStore } from "../../store/stores";

export const SurveyCreateButton = () => {
  const onClickButton = () => mocSurveyStore.setState({ isWriteMode: true });
  const isWriteMode = mocSurveyStore.use.isWriteMode();
  const self = userStore.use.self();
  const MMOC = self && self.items.find((item) => item.thing.name === "MMOC");
  if (isWriteMode || !self) return null;

  return (
    <SurveyCreateButtonContainer>
      <DefaultButton block onClick={onClickButton} type="warning" disabled={!MMOC?.num}>
        Create a new proposal
      </DefaultButton>
    </SurveyCreateButtonContainer>
  );
};

const SurveyCreateButtonContainer = styled.div`
  position: absolute;
  display: flex;
  bottom: 10px;
  right: 0px;
  width: 50%;
  padding: 0 23px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
