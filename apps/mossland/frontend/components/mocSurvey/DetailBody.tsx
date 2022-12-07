import React, { useEffect } from "react";
import styled from "styled-components";
import { Survey, DefaultButton } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";
import { MocSurveyDetailBody } from "./MocSurveyDetail";
export const DetailBody = () => {
  const mocSurveyService = useMocSurvey();
  if (!mocSurveyService.mocSurvey) return null;
  return (
    <MocSurveyDetailBody>
      {mocSurveyService.mocSurvey.type === "objective" ? (
        <MocSurveyDetailBody.ObjectiveForm
          disabled={
            utils.isVoted(mocSurveyService.mocSurveyList, mocSurveyService.mocSurvey.id, mocSurveyService.self?.id) ||
            mocSurveyService.mocSurvey.status !== "opened" ||
            new Date(mocSurveyService.mocSurvey.closeAt).getTime() < Date.now()
          }
          selections={mocSurveyService.mocSurvey.selections}
          selection={mocSurveyService.selection}
          onSelect={(selection) => store.mocSurvey.setState({ selection })}
        />
      ) : (
        <MocSurveyDetailBody.SubjectiveForm
          answer={mocSurveyService.answer}
          disabled={
            utils.isVoted(mocSurveyService.mocSurveyList, mocSurveyService.mocSurvey.id, mocSurveyService.self?.id) ||
            mocSurveyService.mocSurvey.status !== "opened" ||
            new Date(mocSurveyService.mocSurvey.closeAt).getTime() < Date.now()
          }
          onChange={(answer) => store.mocSurvey.setState({ answer })}
        />
      )}
      <>
        <MocSurveyDetailBody.Wrapper className="only-pc">
          <MocSurveyDetailBody.ButtonWrapper>
            <MocSurveyDetailBody.SurveyButton onClick={mocSurveyService.closeDetail}>
              Close
            </MocSurveyDetailBody.SurveyButton>
            <MocSurveyDetailBody.SurveyButton
              className={"bg-[#66fef1]"}
              onClick={() => mocSurveyService.responseMocSurvey()}
              disabled={
                mocSurveyService.isVoted(mocSurveyService.mocSurvey.id) ||
                mocSurveyService.mocSurvey.status !== "opened" ||
                new Date(mocSurveyService.mocSurvey.closeAt).getTime() < Date.now() ||
                (mocSurveyService.mocSurvey.type === "subjective"
                  ? mocSurveyService.answer === null || (mocSurveyService.answer && mocSurveyService.answer.length < 3)
                  : mocSurveyService.mocSurvey.type === "objective" && mocSurveyService.selection === null)
              }
            >
              Submit
            </MocSurveyDetailBody.SurveyButton>
          </MocSurveyDetailBody.ButtonWrapper>
        </MocSurveyDetailBody.Wrapper>
        <MocSurveyDetailBody.Wrapper className="only-mobile">
          <MocSurveyDetailBody.ButtonWrapper>
            <MocSurveyDetailBody.SurveyButton onClick={mocSurveyService.closeDetail}>
              Close
            </MocSurveyDetailBody.SurveyButton>
            <MocSurveyDetailBody.SurveyButton
              className={"bg-[#66FEF1]"}
              onClick={() => mocSurveyService.responseMocSurvey()}
              disabled={
                mocSurveyService.isVoted(mocSurveyService.mocSurvey.id) ||
                mocSurveyService.mocSurvey.status !== "opened" ||
                new Date(mocSurveyService.mocSurvey.closeAt).getTime() < Date.now() ||
                (mocSurveyService.mocSurvey.type === "subjective"
                  ? mocSurveyService.answer && mocSurveyService.answer.length < 3
                  : mocSurveyService.mocSurvey.type === "objective" && !mocSurveyService.selection)
              }
            >
              Submit
            </MocSurveyDetailBody.SurveyButton>
          </MocSurveyDetailBody.ButtonWrapper>
        </MocSurveyDetailBody.Wrapper>
      </>
    </MocSurveyDetailBody>
  );
};
