import React from "react";
import { Utils } from "@shared/util";
import { SurveyIcon } from "@shared/ui-web";
import { gql } from "../../stores";
import { MocSurveyItem } from "./MocSurveyItem";
import { ActiveTag } from "./";

type SurveyItemProps = {
  mocSurvey: gql.MocSurvey;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const Item = ({ mocSurvey }: SurveyItemProps) => {
  // const mocSurveyService = useMocSurvey();
  //!need to change
  return (
    <></>
    // <MocSurveyItem
    //   selected={mocSurvey === mocSurveyService.mocSurvey}
    //   active={
    //     mocSurvey.status === "opened" &&
    //     !mocSurveyService.isVoted(mocSurvey.id) &&
    //     new Date(mocSurvey.closeAt).getTime() > Date.now()
    //   }
    //   onClick={() => mocSurveyService.openDetail(mocSurvey)}
    // >
    //   <MocSurveyItem.TitleWrapper>
    //     <SurveyIcon />
    //     <MocSurveyItem.Title
    //       selected={mocSurvey === mocSurveyService.mocSurvey}
    //       active={
    //         mocSurvey.status === "opened" &&
    //         !mocSurveyService.isVoted(mocSurvey.id) &&
    //         new Date(mocSurvey.closeAt).getTime() > Date.now()
    //       }
    //     >
    //       {mocSurvey.title}
    //     </MocSurveyItem.Title>
    //   </MocSurveyItem.TitleWrapper>
    //   <MocSurveyItem.SubTitleWrapper>
    //     {mocSurvey.status === "opened" && new Date(mocSurvey.closeAt).getTime() > Date.now() && <ActiveTag />}
    //     <MocSurveyItem.Period>
    //       {Utils.toIsoString(mocSurvey.openAt, true)} ~ {Utils.toIsoString(mocSurvey.closeAt, true)}
    //     </MocSurveyItem.Period>
    //   </MocSurveyItem.SubTitleWrapper>
    // </MocSurveyItem>
  );
};
