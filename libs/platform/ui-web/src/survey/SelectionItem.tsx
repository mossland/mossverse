import React from "react";
import styled from "styled-components";
import { Field } from "@shared/ui-web";

type SelectionItemProps = {
  selection: string;
  itemIndex: number;
  removeItem: (itemIndex: number) => void;
  updateItem: (value: string, itemIndex: number) => void;
};

export const SelectionItem = ({ selection, itemIndex, removeItem, updateItem }: SelectionItemProps) => {
  return (
    <StyledSelectionItem>
      <img onClick={() => removeItem(itemIndex)} src="/images/remove.svg" />
      <div className="selection-input">
        <Field.Text label="" value={selection || ""} onChange={(value) => updateItem(value, itemIndex)} />
      </div>
    </StyledSelectionItem>
  );
};

const StyledSelectionItem = styled.div`
  display: flex;
  gap: 10px;
  .selection-input {
    flex: 1;
  }
`;
