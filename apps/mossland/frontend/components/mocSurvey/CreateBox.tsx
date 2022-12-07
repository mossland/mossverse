import React, { useEffect } from "react";
import styled from "styled-components";
import { DefaultButton, Survey } from "@platform/ui-web";
import { Field } from "@shared/ui-web";
import { AiOutlineLeft } from "react-icons/ai";
import { cnst } from "@shared/util";
import { darken } from "polished";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";
import { MocSurveyCreateBox } from "./MocSurveyCreate";
export const CreateBox = () => {
  const mocSurveyService = useMocSurvey();

  useEffect(() => {
    store.mocSurvey.set({ openAt: mocSurveyService.today, closeAt: mocSurveyService.maxDay });
  }, []);

  if (!mocSurveyService.isWriteMode) return null;

  return (
    <MocSurveyCreateBox>
      <MocSurveyCreateBox.Header>
        <MocSurveyCreateBox.Title>Create a new proposal</MocSurveyCreateBox.Title>
        <MocSurveyCreateBox.BackButton onClick={mocSurveyService.closeCreateBox}>
          <AiOutlineLeft />
        </MocSurveyCreateBox.BackButton>
      </MocSurveyCreateBox.Header>
      <MocSurveyCreateBox.Label>Proposal</MocSurveyCreateBox.Label>
      <MocSurveyCreateBox.Input
        value={mocSurveyService.title}
        onChange={(title: string) => store.mocSurvey.setState({ title })}
      />
      <MocSurveyCreateBox.Label>Until</MocSurveyCreateBox.Label>
      <MocSurveyCreateBox.RangePicker
        min={mocSurveyService.today}
        max={mocSurveyService.maxDay}
        openAt={mocSurveyService.openAt}
        closeAt={mocSurveyService.closeAt}
        onChange={(o, c) =>
          store.mocSurvey.setState({ openAt: o ?? mocSurveyService.openAt, closeAt: c ?? mocSurveyService.closeAt })
        }
      />

      <MocSurveyCreateBox.Wrapper className="flex justify-between mt-[10px]">
        <MocSurveyCreateBox.Label className="text-[24px]">
          {mocSurveyService.type === "objective" ? "Answers" : "Answer"}
        </MocSurveyCreateBox.Label>
        <MocSurveyCreateBox.Wrapper className="items-center block mb-4">
          <MocSurveyCreateBox.Label>Type:</MocSurveyCreateBox.Label>
          <MocSurveyCreateBox.Selector
            items={[
              { id: "objective", label: "Multiple" },
              { id: "subjective", label: "Text Box" },
            ]}
            value={mocSurveyService.type}
            onChange={(type: cnst.SurveyType) => store.mocSurvey.setState({ type })}
          />
        </MocSurveyCreateBox.Wrapper>
      </MocSurveyCreateBox.Wrapper>
      {mocSurveyService.type === "objective" && (
        <MocSurveyCreateBox.Wrapper>
          <MocSurveyCreateBox.Selections
            selections={mocSurveyService.selections}
            updateItem={mocSurveyService.updateObjective}
            removeItem={mocSurveyService.removeObjective}
          />
          <MocSurveyCreateBox.AddButton onClick={mocSurveyService.addObjective}>
            + Add New Answer
          </MocSurveyCreateBox.AddButton>
        </MocSurveyCreateBox.Wrapper>
      )}
      {mocSurveyService.type === "subjective" && (
        <MocSurveyCreateBox.TextArea
          value={mocSurveyService.description}
          onChange={(description) => store.mocSurvey.setState({ description })}
        />
      )}
      <MocSurveyCreateBox.CreateButton disabled={!mocSurveyService.creatable()} onClick={mocSurveyService.create}>
        Create
      </MocSurveyCreateBox.CreateButton>
    </MocSurveyCreateBox>
  );
};
