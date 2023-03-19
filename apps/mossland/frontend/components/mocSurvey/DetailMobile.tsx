import React from "react";
import { DetailBody } from ".";
import { gql, st, store } from "../../stores";

export const DetailMobile = () => {
  const mocSurvey = st.use.mocSurvey();
  return <div className="relative mt-[-2px] z-[2] p-[19px]">{mocSurvey !== "loading" && <DetailBody />}</div>;
};
