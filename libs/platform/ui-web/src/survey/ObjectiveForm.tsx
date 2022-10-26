import React from "react";
import styled from "styled-components";
import { surveyStore } from "@platform/data-access";
import { Radio, RadioChangeEvent, Space } from "antd";

type ObjectiveFormProps = {
  selections: string[];
  isVoted: boolean;
  selection: number | null;
  onSelect: (value: number) => void | undefined;
};

export const ObjectiveForm = ({ selections, isVoted, selection, onSelect }: ObjectiveFormProps) => {
  return (
    <StyledObjectiveForm>
      <Radio.Group
        value={selection}
        onChange={(e) => onSelect(e.target.value as number)}
        size="large"
        buttonStyle="solid"
        className="objective"
        disabled={isVoted}
      >
        {selections.map((sel, index) => {
          return (
            <Radio
              key={index}
              value={index}
              className="object-item"
              // onClick={() => selectResponse(index)}
              checked={selection === index}
            >
              {sel}
            </Radio>
          );
        })}
      </Radio.Group>
    </StyledObjectiveForm>
  );
};

const StyledObjectiveForm = styled.div`
  margin-bottom: 16px;
  .object-item {
    font-family: Ubuntu Mono;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 16px;
    margin-bottom: 17px;
    display: block;
  }
`;
