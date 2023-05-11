import React, { useEffect } from "react";
import { AiOutlineLeft } from "react-icons/ai";
import { cnst } from "@shared/util";
import { darken } from "polished";
import { gql, st, store } from "../../stores";
import { MocSurveyCreateBox } from "./MocSurveyCreate";
import { client } from "@shared/util-client";
import dayjs from "dayjs";
export const CreateBox = () => {
  const today = dayjs();
  const maxDay = dayjs().add(2, "month");
  const self = st.use.self();
  const me = st.use.me();
  const isWriteMode = st.use.isWriteMode();
  const mocSurveyForm = st.use.mocSurveyForm();
  const ownershipList = st.use.ownershipListInMoney();
  useEffect(() => {
    if (ownershipList === "loading") return;
    st.do.setMocSurveyForm({
      ...mocSurveyForm,
      selections: [""],
      type: "objective",
      openAt: today,
      closeAt: maxDay,
      // creator:
      //   (me.wallets.find(async (w) => w.address === (await client.wallet.getAccount())) as gql.shared.Wallet) ?? null,
      creator: self,
      thing: gql.shared.Ownership.get(ownershipList, "MMOC")?.thing ?? null,
    });
  }, []);

  if (!isWriteMode || ownershipList === "loading") return null;

  return (
    <MocSurveyCreateBox>
      <MocSurveyCreateBox.Header>
        <MocSurveyCreateBox.Title>Create a new proposal</MocSurveyCreateBox.Title>
        <MocSurveyCreateBox.BackButton onClick={() => st.do.setIsWriteMode(false)}>
          <AiOutlineLeft />
        </MocSurveyCreateBox.BackButton>
      </MocSurveyCreateBox.Header>
      <MocSurveyCreateBox.Label>Proposal</MocSurveyCreateBox.Label>
      <MocSurveyCreateBox.Input
        value={mocSurveyForm.title}
        onChange={(title: string) => st.do.setMocSurveyForm({ ...mocSurveyForm, title })}
      />
      <MocSurveyCreateBox.Label>Until</MocSurveyCreateBox.Label>
      <MocSurveyCreateBox.RangePicker
        min={today}
        max={maxDay}
        openAt={mocSurveyForm.openAt}
        closeAt={mocSurveyForm.closeAt}
        onChange={(o, c) =>
          st.do.setMocSurveyForm({
            ...mocSurveyForm,
            openAt: o ?? mocSurveyForm.openAt,
            closeAt: c ?? mocSurveyForm.closeAt,
          })
        }
      />
      <MocSurveyCreateBox.Label>Description</MocSurveyCreateBox.Label>
      <MocSurveyCreateBox.TextArea
        value={mocSurveyForm.description}
        onChange={(description: string) => st.do.setDescriptionOnMocSurvey(description)}
      />
      <MocSurveyCreateBox.Wrapper className="flex justify-between">
        <MocSurveyCreateBox.Label className="text-[24px]">
          {mocSurveyForm.type === "objective" ? "Answers" : "Answer"}
        </MocSurveyCreateBox.Label>
        <MocSurveyCreateBox.Wrapper className="flex">
          <MocSurveyCreateBox.Label className="flex items-center justify-center mb-5">Type:</MocSurveyCreateBox.Label>
          <MocSurveyCreateBox.Selector
            items={[
              { id: "objective", label: "Multiple" },
              { id: "subjective", label: "Text Box" },
            ]}
            value={mocSurveyForm.type}
            onChange={(type: cnst.SurveyType) => st.do.setMocSurveyForm({ ...mocSurveyForm, type })}
          />
        </MocSurveyCreateBox.Wrapper>
      </MocSurveyCreateBox.Wrapper>
      {mocSurveyForm.type === "objective" && (
        <MocSurveyCreateBox.Wrapper>
          <MocSurveyCreateBox.Selections
            selections={mocSurveyForm.selections}
            updateItem={(value, idx) => {
              st.do.setMocSurveyForm({
                ...mocSurveyForm,
                selections: mocSurveyForm.selections.map((cur, index) => (index === idx ? value : cur)),
              });
            }}
            removeItem={(idx) =>
              st.do.setMocSurveyForm({
                ...mocSurveyForm,
                selections: mocSurveyForm.selections.filter((cur, index) => index !== idx),
              })
            }
          />
          <MocSurveyCreateBox.AddButton
            onClick={() =>
              st.do.setMocSurveyForm({
                ...mocSurveyForm,
                selections: [...mocSurveyForm.selections, ""],
              })
            }
          >
            + Add New Answer
          </MocSurveyCreateBox.AddButton>
        </MocSurveyCreateBox.Wrapper>
      )}
      {mocSurveyForm.type === "subjective" && (
        <MocSurveyCreateBox.TextArea
          value={mocSurveyForm.description}
          onChange={(description) => st.do.setMocSurveyForm({ ...mocSurveyForm, description })}
        />
      )}
      <MocSurveyCreateBox.CreateButton
        disabled={
          !gql.MocSurvey.creatable(mocSurveyForm as gql.MocSurvey) ||
          !gql.shared.Ownership.get(ownershipList, "MMOC")?.value
        }
        // onClick={mocSurveyService.create}
        onClick={() => st.do.createMocSurvey()}
      >
        Create
      </MocSurveyCreateBox.CreateButton>
    </MocSurveyCreateBox>
  );
};
