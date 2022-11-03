import React, { useEffect } from "react";
import styled from "styled-components";
import { Survey, DefaultButton } from "@platform/ui-web";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

export const DetailBody = () => {
  const mocSurveyService = useMocSurvey();
  if (!mocSurveyService.mocSurvey) return null;

  return (
    <StyledSurveyDetailBody>
      {mocSurveyService.mocSurvey.type === "objective" ? (
        <Survey.ObjectiveForm
          isVoted={utils.isVoted(
            mocSurveyService.mocSurveyList,
            mocSurveyService.mocSurvey.id,
            mocSurveyService.self?.id
          )}
          selections={mocSurveyService.selections}
          selection={mocSurveyService.selection}
          onSelect={(selection) => store.mocSurvey.setState({ selection })}
        />
      ) : (
        <Survey.SubjectiveForm
          answer={mocSurveyService.answer}
          isVoted={utils.isVoted(
            mocSurveyService.mocSurveyList,
            mocSurveyService.mocSurvey.id,
            mocSurveyService.self?.id
          )}
          onChange={(answer) => store.mocSurvey.setState({ answer })}
        />
      )}
      <>
        <div className="only-pc">
          <div className="button-container">
            <DefaultButton className="survey-button" block onClick={mocSurveyService.closeDetail}>
              Close
            </DefaultButton>
            <DefaultButton
              className="survey-button"
              block
              disabled={utils.isVoted(
                mocSurveyService.mocSurveyList,
                mocSurveyService.mocSurvey.id,
                mocSurveyService.self?.id
              )}
              type={
                utils.isVoted(mocSurveyService.mocSurveyList, mocSurveyService.mocSurvey.id, mocSurveyService.self?.id)
                  ? "default"
                  : "primary"
              }
              onClick={() => mocSurveyService.responseMocSurvey()}
            >
              Submit
            </DefaultButton>
          </div>
        </div>
        <div className="only-mobile">
          <div className="button-container">
            <DefaultButton className="survey-button" block onClick={mocSurveyService.closeDetail}>
              Close
            </DefaultButton>
            <DefaultButton
              className="survey-button"
              block
              disabled={utils.isVoted(
                mocSurveyService.mocSurveyList,
                mocSurveyService.mocSurvey.id,
                mocSurveyService.self?.id
              )}
              type={
                utils.isVoted(mocSurveyService.mocSurveyList, mocSurveyService.mocSurvey.id, mocSurveyService.self?.id)
                  ? "default"
                  : "primary"
              }
              onClick={() => mocSurveyService.responseMocSurveyMobile()}
            >
              Submit
            </DefaultButton>
          </div>
        </div>
      </>
    </StyledSurveyDetailBody>
  );
};

const StyledSurveyDetailBody = styled.div`
  background-color: #e8e8e8;
  padding: 23px;
  .button-container {
    display: flex;
    justify-content: space-around;
    gap: 10px;
    .survey-button button {
      min-height: 44px;
    }
    @media screen and (max-width: 800px) {
      justify-content: center;
      gap: 18px;
    }
  }
`;
