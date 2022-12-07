import React, { useEffect, ReactNode } from "react";
import styled from "styled-components";
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
