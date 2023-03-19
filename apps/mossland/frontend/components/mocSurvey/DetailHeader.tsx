import React from "react";
import { SurveyIcon } from "@shared/ui-web";
import { cnst, Utils } from "@shared/util";
import { MocSurveyDetailHeader } from "./MocSurveyDetail";
import { st } from "../../stores";
import { ActiveTag } from "./";

export const DetailHeader = () => {
  // const mocSurveyService = useMocSurvey();
  const mocSurvey = st.use.mocSurvey();
  return (
    <MocSurveyDetailHeader>
      {mocSurvey === "loading" ? (
        <></>
      ) : (
        <>
          <MocSurveyDetailHeader.TitleWrapper>
            <SurveyIcon />
            <MocSurveyDetailHeader.Title>{mocSurvey.title}</MocSurveyDetailHeader.Title>
          </MocSurveyDetailHeader.TitleWrapper>
          <MocSurveyDetailHeader.SubTitleWrapper>
            {mocSurvey.status === "opened" && mocSurvey.isExpired() && <ActiveTag />}
            <MocSurveyDetailHeader.Period>
              {mocSurvey.openAt.format("YYYY-MM-DD")} ~ {mocSurvey.closeAt.format("YYYY-MM-DD")}
            </MocSurveyDetailHeader.Period>
          </MocSurveyDetailHeader.SubTitleWrapper>
        </>
      )}
    </MocSurveyDetailHeader>
  );
};
