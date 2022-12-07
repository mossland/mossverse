import React from "react";
import { MocSurveyHeader } from "./MocSurveyHeader";
import { MyAddress, Connect } from "../common";
import { useMocSurvey } from "./services/useMocSurvey";
import { FilterButtons } from "./FilterButtons";

export const Header = () => {
  const mocSurveyService = useMocSurvey();
  return (
    <MocSurveyHeader>
      <MocSurveyHeader.TopField>
        <MocSurveyHeader.Title>Proposals</MocSurveyHeader.Title>
        <MocSurveyHeader.Right>{mocSurveyService.wallet ? <MyAddress /> : <Connect />}</MocSurveyHeader.Right>
      </MocSurveyHeader.TopField>
      <FilterButtons />
    </MocSurveyHeader>
  );
};
