import React, { useEffect } from "react";
import styled from "styled-components";
import { types, userStore } from "@platform/data-access";
import { Survey, DefaultButton } from "@platform/ui-web";
import { walletStore, networkStore, keyringStore } from "@shared/data-access";
import { mocSurveyStore } from "apps/mossland/frontend/stores";
import { utils } from "apps/mossland/frontend";

export const SurveyDetailBody = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const mocSurveys = mocSurveyStore.use.mocSurveys();
  const mocSurvey = mocSurveyStore.use.mocSurvey();
  const answer = mocSurveyStore.use.answer();
  const selection = mocSurveyStore.use.selection();
  const sign = keyringStore.use.sign();
  const signWalletConnect = keyringStore.use.signWalletConnect();
  const responseMocSurvey = mocSurveyStore.use.responseMocSurvey();

  // const isVotable = (): boolean => {
  //   if (mocSurvey && mocSurvey.status === "opened" && self && !utils.isVoted(mocSurveys, mocSurvey.id, self.id))
  //     return true;
  //   else return false;
  // };

  const onSubmit = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return alert("해당 컨트랙 네트워크의 지갑을 소유하고 있지 않습니다.");
    await sign(wallet.network.provider);
    await responseMocSurvey(self);
  };

  const onSubmitMobile = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return alert("해당 컨트랙 네트워크의 지갑을 소유하고 있지 않습니다.");
    await signWalletConnect(wallet.network.provider);
    await responseMocSurvey(self);
  };

  const onCancel = () => {
    mocSurveyStore.setState({ ...types.defaultSurveyResponse, mocSurvey: null, response: null });
    networkStore.setState({ network: null });
  };

  if (!mocSurvey) return null;

  return (
    <StyledSurveyDetailBody>
      {mocSurvey.type === "objective" ? (
        <Survey.ObjectiveForm
          isVoted={utils.isVoted(mocSurveys, mocSurvey.id, self?.id)}
          selections={mocSurvey.selections}
          selection={selection}
          onSelect={(selection) => mocSurveyStore.setState({ selection })}
        />
      ) : (
        <Survey.SubjectiveForm
          answer={answer}
          isVoted={utils.isVoted(mocSurveys, mocSurvey.id, self?.id)}
          onChange={(description) => mocSurveyStore.setState({ description })}
        />
      )}
      <>
        <div className="only-pc">
          <div className="button-container">
            <DefaultButton className="survey-button" block onClick={onCancel}>
              Close
            </DefaultButton>
            <DefaultButton
              className="survey-button"
              block
              disabled={utils.isVoted(mocSurveys, mocSurvey.id, self?.id)}
              type={utils.isVoted(mocSurveys, mocSurvey.id, self?.id) ? "default" : "primary"}
              onClick={onSubmit}
            >
              Submit
            </DefaultButton>
          </div>
        </div>
        <div className="only-mobile">
          <div className="button-container">
            <DefaultButton className="survey-button" block onClick={onCancel}>
              Close
            </DefaultButton>
            <DefaultButton
              className="survey-button"
              block
              disabled={utils.isVoted(mocSurveys, mocSurvey.id, self?.id)}
              type={utils.isVoted(mocSurveys, mocSurvey.id, self?.id) ? "default" : "primary"}
              onClick={onSubmitMobile}
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
