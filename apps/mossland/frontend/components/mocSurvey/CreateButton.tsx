import React from "react";
import { gql, st, store } from "../../stores";
import { MocSurveyCreateButton } from "./MocSurveyCreate";
export const CreateButton = () => {
  const self = st.use.self();
  const isWriteMode = st.use.isWriteMode();
  const ownershipList = st.use.ownershipListInMoney();
  //!need to change
  return (
    <>
      {isWriteMode || !self.id?.length || ownershipList === "loading" ? (
        <></>
      ) : (
        <MocSurveyCreateButton
          onClick={() => {
            st.set({ isWriteMode: true });
            st.do.newMocSurvey({ type: "objective" });
          }}
          disabled={!gql.shared.Ownership.get(ownershipList, "MMOC")}
        >
          Create a new propsal
        </MocSurveyCreateButton>
      )}
    </>
  );
};
