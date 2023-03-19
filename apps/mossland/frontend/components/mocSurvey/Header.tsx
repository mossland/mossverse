import React from "react";
import { MocSurveyHeader } from "./MocSurveyHeader";
import { MyAddress, Connect } from "../common";
import { FilterButtons } from "./FilterButtons";
import { st } from "../../stores";

export const Header = () => {
  // const mocSurveyService = useMocSurvey();
  const myKeyring = st.use.myKeyring();
  return (
    <MocSurveyHeader>
      <MocSurveyHeader.TopField className="flex">
        <div className="w-1/2">
          <MocSurveyHeader.Title>Proposals</MocSurveyHeader.Title>
          <FilterButtons />
        </div>
        <div className="w-1/2">
          <MocSurveyHeader.Right>{myKeyring.wallets.length ? <MyAddress /> : <Connect />}</MocSurveyHeader.Right>
        </div>
      </MocSurveyHeader.TopField>
    </MocSurveyHeader>
  );
};
