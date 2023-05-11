import React from "react";
import { DetailHeader, DetailBody, CreateBox } from "./";
import { gql, st, store } from "../../stores";

export const Detail = () => {
  const isWriteMode = st.use.isWriteMode();
  const mocSurvey = st.use.mocSurvey();
  if (isWriteMode) {
    return (
      <div className="hidden md:block pb-[650px] flex-1 border-l-[2px] border-black">
        <CreateBox />
      </div>
    );
  }

  return (
    <div className="hidden md:block pb-[650px] flex-1 border-l-[2px] border-black">
      {!mocSurvey ? (
        <></>
      ) : (
        <>
          <DetailHeader />
          <DetailBody />
        </>
      )}
    </div>
  );
};
