import React, { useEffect, ReactNode } from "react";
import { Detail, List } from "./";
import { MocSurveyBody } from "./MocSurveyBody";
export const Body = () => {
  return (
    <MocSurveyBody>
      <List />
      <Detail />
    </MocSurveyBody>
  );
};
