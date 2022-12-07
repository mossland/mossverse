import React from "react";
import styled from "styled-components";
import { Radio, RadioChangeEvent, Space } from "antd";
import { Survey } from "..";

type ObjectiveFormProps = {
  selections: string[];
  addItem: (value: number) => void;
  updateItem: (value: string, itemIndex: number) => void;
  removeItem: (value: number) => void;
};

export const ObjectiveGenerator = ({ selections, addItem, updateItem, removeItem }: ObjectiveFormProps) => {
  return (
    <Survey.Wrapper>
      {!selections.length ? (
        <Survey.SelectionItem
          selection={selections?.[0] ?? ""}
          itemIndex={0}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      ) : (
        selections.map((selection, index) => (
          <Survey.SelectionItem
            key={index}
            selection={selection}
            itemIndex={index}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        ))
      )}
      <Survey.Button className="add-answer-button" onClick={() => addItem(0)}>
        + Add New Answer
      </Survey.Button>
    </Survey.Wrapper>
  );
};
