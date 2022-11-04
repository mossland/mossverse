import React from "react";
import styled from "styled-components";
import { Field } from "@shared/ui-web";
import { Survey } from "..";

type SelectionItemProps = {
  selection: string;
  itemIndex: number;
  removeItem: (itemIndex: number) => void;
  updateItem: (value: string, itemIndex: number) => void;
};

export const SelectionItem = ({ selection, itemIndex, removeItem, updateItem }: SelectionItemProps) => {
  return (
    <StyledSelectionItem>
      <Survey.Button
        disabled={itemIndex === 0}
        className="remove-button"
        onClick={() => removeItem(itemIndex)}
        src="/images/remove.svg"
      >
        <Survey.Image src="/images/remove.svg" alt="remove" />
      </Survey.Button>
      <Survey.Wrapper className="selection-input">
        <Survey.TextInput value={selection} onChangeCallback={(value) => updateItem(value, itemIndex)} />
      </Survey.Wrapper>
    </StyledSelectionItem>
  );
};

const StyledSelectionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .remove-button {
    margin-right: 10px;
    border: 10px;
  }
  /* gap: 10px; */
  .selection-input {
    /* flex: 1; */
    width: 100%;
    /* background-color: red; */
    input {
      width: 100%;
    }
  }
`;
