import React from "react";
import styled from "styled-components";
import { userStore } from "@platform/data-access";
import { walletStore, keyringStore } from "@shared/data-access";
import { DefaultButton, Survey } from "@platform/ui-web";
import { Field } from "@shared/ui-web";
import { AiOutlineLeft } from "react-icons/ai";
import { cnst } from "@shared/util";
import { darken } from "polished";
import { defaultContract, defaultNetwork } from "libs/shared/data-access/src/types";
import { mocSurveyStore } from "../../store/stores";

export const SurveyCreate = () => {
  const isWriteMode = mocSurveyStore.use.isWriteMode();
  const title = mocSurveyStore.use.title();
  const type = mocSurveyStore.use.type();
  const description = mocSurveyStore.use.description();
  const selections = mocSurveyStore.use.selections();
  const openAt = mocSurveyStore.use.openAt();
  const closeAt = mocSurveyStore.use.closeAt();
  const create = mocSurveyStore.use.create();
  const initSurvey = mocSurveyStore.use.init();
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const sign = keyringStore.use.sign();
  const today = new Date();
  const max = new Date(today.getTime() + 1000 * 60 * 60 * 24 * 60);
  const onClickCreate = async () => {
    if (!self || !self.keyring) return alert("로그인 한 유저만 투표할 수 있습니다.");
    if (!wallet) return;
    mocSurveyStore.setState({ creator: self, policy: [] });
    await sign(wallet.network.provider);
    await create();
    await initSurvey();
    mocSurveyStore.setState({ isWriteMode: false });
  };
  const onClickBack = () => mocSurveyStore.setState({ isWriteMode: false });

  const updateItem = (value: string, itemIndex: number) => {
    let newSelections = [""];
    if (selections && selections.length) newSelections = [...selections];
    mocSurveyStore.setState({ selections: newSelections?.map((cur, index) => (index === itemIndex ? value : cur)) });
  };

  const removeItem = (itemIndex: number) => {
    mocSurveyStore.setState({ selections: selections?.filter((cur, index) => index !== itemIndex) });
  };

  const addItem = () => {
    mocSurveyStore.setState(selections ? { selections: [...selections, ""] } : { selections: [""] });
  };

  if (!isWriteMode) return null;
  return (
    <SurveyCreateContainer>
      <div className="header">
        <div className="back-button" onClick={onClickBack}>
          <AiOutlineLeft />
        </div>
        <div>Create a new proposal</div>
      </div>
      <Field.Container className="body">
        <Field.Text label="Proposal" value={title} onChange={(title) => mocSurveyStore.setState({ title })} />
        <Field.RangePicker
          label="Until"
          min={today}
          max={max}
          openAt={openAt}
          closeAt={closeAt}
          onChange={(openAt, closeAt) => mocSurveyStore.setState({ openAt, closeAt })}
        />
        <div className="answer-label">
          <div className="label">Answers</div>
          <Field.SelectItem
            label="Type:"
            items={[
              { id: "objective", label: "Multiple" },
              { id: "subjective", label: "Text Box" },
            ]}
            value={type}
            onChange={(type: cnst.SurveyType) => mocSurveyStore.setState({ type })}
          />
        </div>
        {type === "objective" && (
          <div>
            <Survey.SelectionItem
              selection={selections?.[0] || ""}
              itemIndex={0}
              removeItem={removeItem}
              updateItem={updateItem}
            />
            {selections &&
              selections.length > 1 &&
              selections
                .filter((selection, index) => index > 0)
                .map((selection, index) => (
                  <Survey.SelectionItem
                    key={index}
                    selection={selection || ""}
                    itemIndex={index + 1}
                    removeItem={removeItem}
                    updateItem={updateItem}
                  />
                ))}
            <div className="add-answer-button" onClick={addItem}>
              + Add New Answer
            </div>
          </div>
        )}
        {type === "subjective" && (
          <Field.TextArea
            label=""
            value={description}
            onChange={(value) => mocSurveyStore.setState({ description: value })}
          />
        )}
      </Field.Container>
      <DefaultButton block onClick={onClickCreate} type="warning">
        Create
      </DefaultButton>
    </SurveyCreateContainer>
  );
};

const SurveyCreateContainer = styled.div`
  .header {
    font-size: 24px;
    text-align: center;
    padding-bottom: 18px;
    position: relative;
    .back-button {
      position: absolute;
      left: 10px;
      top: 6px;
      cursor: pointer;
    }
  }
  .body {
    margin-bottom: 18px;
  }

  .add-answer-button {
    border: 1px solid #000;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
    transition: all 0.5s;
    &:hover,
    &:active {
      background-color: ${(props) => darken(0.1, "#fff")};
    }
  }

  .answer-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
`;
