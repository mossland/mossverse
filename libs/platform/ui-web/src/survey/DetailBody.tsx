import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, store } from "@platform/data-access";
import { Radio, Space } from "antd";
import { Utils } from "@shared/util";

type SurveyDetailBodyProps = {
  survey: gql.Survey;
  voted: boolean;
  answer: string | null;
  selection: number | null;
};

export const DetailBody = ({ survey, voted, answer, selection }: SurveyDetailBodyProps) => {
  const sign = store.shared.keyring.use.sign();
  const self = store.user.use.self();
  const wallet = store.shared.wallet.use.wallet();
  const respondSurvey = store.survey.use.respondSurvey();

  const isVotable = (): boolean => {
    if (!voted && self && self.keyring?.wallets.find((wallet) => wallet.network.id === survey.contract.network.id))
      return true;
    else return false;
  };
  const onSubmit = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return alert("해당 컨트랙 네트워크의 지갑을 소유하고 있지 않습니다.");
    await sign(wallet.network.provider);
    await respondSurvey(wallet);
  };

  const onCancel = () => {
    store.survey.setState({ ...gql.defaultSurveyResponse, survey: null, response: null });
    store.shared.network.setState({ network: null });
  };

  return (
    <StyledDetailBody>
      {/* {survey.type === "objective" ? (
        <ObjectiveForm isVoted={!isVotable()} selections={survey.selections} selection={selection} />
      ) : (
        <SubjectiveForm answer={answer} isVoted={!isVotable()} />
      )} */}
      {!isVotable() && (
        <div className="button-container">
          <Button onClick={onCancel}>Close</Button>
          <Button disabled={!isVotable()} backgroundColor={!isVotable() ? "#D8D8D8" : "#66fef0"} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}
    </StyledDetailBody>
  );
};

type SubjectiveFormProps = {
  isVoted: boolean;
  answer: string | null;
};

const SubjectiveForm = ({ answer, isVoted }: SubjectiveFormProps) => {
  return (
    <div className="subjective">
      <textarea
        value={answer ?? ""}
        disabled={isVoted}
        placeholder="주관식 입니다."
        onChange={(e) => store.survey.setState({ answer: e.target.value })}
        className="subject-input"
      ></textarea>
    </div>
  );
};

const StyledDetailBody = styled.div`
  background-color: #e8e8e8;
  padding: 30px;

  .button-container {
    display: flex;
    justify-content: space-around;
    @media screen and (max-width: 800px) {
      justify-content: center;
      gap: 24px;
    }

    .close-button {
      width: 166px;
      height: 48px;
      background-color: white;
      border: 2px solid #000000;
      border-radius: 10px;
      font-family: Ubuntu Mono;
      font-style: normal;
      font-weight: 400;
      font-size: 22px;
      line-height: 22px;
      cursor: pointer;
      :hover {
        opacity: 0.5;
      }
    }
    .submit-button {
      width: 166px;
      height: 48px;
      background-color: #66fef0;
      border: 2px solid #000000;
      border-radius: 10px;
      font-family: Ubuntu Mono;
      font-style: normal;
      font-weight: 400;
      font-size: 22px;
      line-height: 22px;
      cursor: pointer;
      :hover {
        opacity: 0.5;
      }
    }
  }
`;

const Button = styled.button<{ backgroundColor?: string }>`
  width: 166px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000000;
  border-radius: 10px;
  font-family: Ubuntu Mono;
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 22px;
  :enabled {
    cursor: pointer;
    background-color: ${(props) => props.backgroundColor ?? "white"};

    :hover {
      opacity: 0.5;
    }
  }
  :disabled {
    background-color: ${(props) => props.backgroundColor ?? "white"};
    border-color: gray;
    color: gray;
  }
`;
