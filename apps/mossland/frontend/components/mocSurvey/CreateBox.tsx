import React, { useEffect } from "react";
import styled from "styled-components";
import { DefaultButton, Survey } from "@platform/ui-web";
import { Field } from "@shared/ui-web";
import { AiOutlineLeft } from "react-icons/ai";
import { cnst } from "@shared/util";
import { darken } from "polished";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

export const CreateBox = () => {
  const mocSurveyService = useMocSurvey();

  useEffect(() => {
    store.mocSurvey.setState({ openAt: mocSurveyService.today, closeAt: mocSurveyService.maxDay });
  }, []);

  if (!mocSurveyService.isWriteMode) return null;

  return (
    <CreateBoxContainer>
      <Survey.Wrapper className="header">
        <Survey.Button className={`back-button`} onClick={mocSurveyService.closeCreateBox}>
          <AiOutlineLeft />
        </Survey.Button>
        <Survey.Title className="title">Create a new proposal</Survey.Title>
      </Survey.Wrapper>
      <Survey.Text className="label">Proposal</Survey.Text>
      <Survey.TextInput
        className="input"
        value={mocSurveyService.title}
        onChangeCallback={(title: string) => store.mocSurvey.setState({ title })}
      />
      <Survey.Text className="label">Until</Survey.Text>
      <Survey.RangePicker
        className="input"
        min={mocSurveyService.today}
        max={mocSurveyService.maxDay}
        openAt={mocSurveyService.openAt}
        closeAt={mocSurveyService.closeAt}
        onChange={(o, c) =>
          store.mocSurvey.setState({ openAt: o ?? mocSurveyService.openAt, closeAt: c ?? mocSurveyService.closeAt })
        }
      />
      <Survey.Wrapper className="answer-label">
        <Survey.Text className="label">{mocSurveyService.type === "objective" ? "Answers" : "Answer"}</Survey.Text>
        <Field.SelectItem
          label="Type:"
          items={[
            { id: "objective", label: "Multiple" },
            { id: "subjective", label: "Text Box" },
          ]}
          value={mocSurveyService.type}
          onChange={(type: cnst.SurveyType) => store.mocSurvey.setState({ type })}
        />
      </Survey.Wrapper>
      {mocSurveyService.type === "objective" && (
        <Survey.ObjectiveGenerator
          selections={mocSurveyService.selections}
          updateItem={mocSurveyService.updateObjective}
          removeItem={mocSurveyService.removeObjective}
          addItem={mocSurveyService.addObjective}
        />
      )}
      {mocSurveyService.type === "subjective" && (
        <Survey.TextArea
          className="subjective-input"
          value={mocSurveyService.description}
          onChangeCallback={(description) => store.mocSurvey.setState({ description })}
        />
      )}
      <Survey.Button
        backgroundColor="#FFE177"
        className="create-button"
        disabled={!mocSurveyService.creatable()}
        onClick={mocSurveyService.create}
      >
        Create
      </Survey.Button>
    </CreateBoxContainer>
  );
};

const CreateBoxContainer = styled.div`
  padding: 10px 20px;
  .header {
    font-size: 24px;
    text-align: center;
    padding-bottom: 18px;
    position: relative;
    .back-button {
      border: 0;
      /* width: 100px;
      height: 100px; */
      font-size: 24px;
      left: 0px;
      top: 0px;
      background-color: transparent;
      position: absolute;
      cursor: pointer;
    }
  }
  .title {
    margin-top: 15px;
  }
  .label {
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
    font-weight: 100;
    margin-top: 20px;
  }
  .input {
    width: 100%;
  }

  .add-answer-button {
    border: 1px solid #000;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    display: inline-block;
  }

  .answer-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    .label {
      text-align: left;
      color: #555;
      font-size: 16px;
      font-weight: 400;
    }
    .ant-space {
      display: flex;
      margin-bottom: 0px;
    }
    .ant-space-item {
      .label {
        text-align: right;
      }
    }
  }

  .ant-space {
    display: block;
    margin-bottom: 12px;
  }
  .ant-space-item {
    .ant-input,
    .ant-picker-range {
      border-radius: 6px;
      font-size: 16px;
      width: 100%;
    }
    .label {
      text-align: left;
      color: #555;
      font-size: 16px;
      font-weight: 400;
    }
  }
  .subjective-input{
    width: 100%;
    min-height: 300px;

  }
  .create-button {
    border: 0;
    width: 100%;
    height: 50px;
    font-size: 22px;
    font-weight: 400;
    border: 2px solid ${(props) => props.theme.color.black};
    /* background-color: ${(props) => props.theme.color.yellow};
    &:hover,
    &:active {
      background-color: ${darken(0.1, "#FFE177")};
    } */
    margin-top: 20px;
  }
`;
