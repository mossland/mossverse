import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { Survey } from "@platform/ui-web";
import { store } from "../../stores";
import { DetailMobile } from ".";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { SurveyIcon } from "@shared/ui-web";
import { useMocSurvey } from "./services/useMocSurvey";
import { Item } from "./";
import { MocSurveyList } from "./MocSurveyList";

export const List = () => {
  const mocSurveyService = useMocSurvey();

  useEffect(() => {
    if (!mocSurveyService.self?.keyring) return;
    store.shared.wallet.setState({ wallet: mocSurveyService.self.keyring.wallets[0] });
  }, [mocSurveyService.self?.keyring]);

  return (
    <>
      <MocSurveyList className="only-pc">
        {mocSurveyService
          .activeMocSurveyList()
          .reverse()
          .map((sv, index) => (
            <Item key={index} mocSurvey={sv} />
          ))}
      </MocSurveyList>
      <MocSurveyList className="only-mobile">
        <Accordion allowZeroExpanded>
          {mocSurveyService.activeMocSurveyList().map((sv, index) => (
            <div key={index}>
              <AccordionItem uuid={`item${index}`}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <Item mocSurvey={sv} />
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>{sv === mocSurveyService.mocSurvey && <DetailMobile />}</AccordionItemPanel>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </MocSurveyList>
    </>
  );
};

const SurveyListContainer = styled.div`
  overflow-y: auto;
  /* height: calc(100vh - 130px); */
  flex: 1;
  position: relative;
`;

const itemStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 18px;
  height: 92px;
  width: 100%;
  border: 0px;
  border-top: 2px solid;
  border-bottom: 2px solid;
  transition-duration: 0.5s;
  position: relative;
  margin-top: -2px;
  .title-container {
    display: flex;
  }

  .sub-title-container {
    display: flex;
    align-items: self-end;
    .tag {
      margin-bottom: -2px;
    }
  }

  :hover {
    background-color: #f4f4f4;
  }
  cursor: pointer;
`;

const titleStyle = css`
  margin-left: 8px;
  font-family: Ubuntu Mono;
  text-align: left;
  font-style: normal;
  font-size: 16px;
  line-height: 16px;
`;
