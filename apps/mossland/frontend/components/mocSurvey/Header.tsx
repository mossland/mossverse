import React, { useEffect, ReactNode } from "react";
import styled, { css } from "styled-components";
import { ExchangeItem, Survey } from "@platform/ui-web";
import { FilterButtons } from "./FilterButtons";
import { Title, MyAddress, Connect } from "../common";
import { store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

export const Header = () => {
  const mocSurveyService = useMocSurvey();
  return (
    <HeaderContainer>
      <Survey.Wrapper className="top-field">
        <Survey.Text className="title">Proposals</Survey.Text>
        <Survey.Wrapper className="right">{mocSurveyService.wallet ? <MyAddress /> : <Connect />}</Survey.Wrapper>
      </Survey.Wrapper>
      <FilterButtons />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  position: relative;
  padding: 20px;
  height: 101px;
  h1 {
    margin-top: 6px;
  }
  .top-field {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .right {
    /* width: 50%; */
    flex: 1;
  }
  .address {
    br {
      display: none;
    }
  }
  .title {
    width: 50%;
    flex: 1;
    font-family: Ubuntu Mono;
    font-weight: 700;
    font-size: 26px;
    line-height: 1em;
    color: #000000;
    border-width: 10px;

    margin-bottom: 20px;
  }
`;

const TopField = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
const customTitle = css`
  width: 50%;
  flex: 1;
  font-family: Ubuntu Mono;
  font-weight: 700;
  font-size: 26px;
  line-height: 1em;
  color: #000000;
  border-width: 10px;

  margin-bottom: 20px;
`;
