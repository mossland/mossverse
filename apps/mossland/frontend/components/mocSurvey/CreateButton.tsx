import React from "react";
import styled, { css } from "styled-components";
import { DefaultButton } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { ExchangeItem, Survey } from "@platform/ui-web";
import { darken } from "polished";
import { useMocSurvey } from "./services/useMocSurvey";
import { MocSurveyCreateButton } from "./MocSurveyCreate";
export const CreateButton = () => {
  const mocSurveyService = useMocSurvey();
  if (mocSurveyService.isWriteMode || !mocSurveyService.self) return null;
  return (
    <MocSurveyCreateButton onClick={mocSurveyService.openCreateBox} disabled={!mocSurveyService.hasMmoc()}>
      Create a new propsal
    </MocSurveyCreateButton>
  );
};
