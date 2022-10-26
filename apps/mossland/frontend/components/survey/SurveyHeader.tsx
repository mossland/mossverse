import React, { useEffect, ReactNode } from "react";
import styled from "styled-components";
import { ExchangeItem } from "@platform/ui-web";
import { ButtonField } from "./ButtonField";
import { Title, MyAddress, Connect } from "../common";
import { userStore, types } from "@platform/data-access";
import { keyringStore, networkStore, walletStore } from "@shared/data-access";
import { LoginSelector } from "@shared/ui-web";

type SurveyHeaderProps = {
  //
};

export const SurveyHeader = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();

  return (
    <Container>
      <div className="top-field">
        <Title>Proposals</Title>
        <div className="right">{wallet ? <MyAddress /> : <Connect />}</div>
      </div>
      {<ButtonField />}
    </Container>
  );
};

const Container = styled.div`
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

    .right {
      width: 50%;
    }
  }
  .address {
    br {
      display: none;
    }
  }
`;
