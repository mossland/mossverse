import React, { useEffect } from "react";
import styled from "styled-components";
import { Survey } from "@platform/ui-web";
import { userStore, checkIsActiveSurvey } from "@platform/data-access";

import { walletStore } from "@shared/data-access";
import { SurveyMobileDetail } from "./";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { mocSurveyStore } from "../../store/stores";
import { types } from "../../store";
import { utils } from "../..";

export const SurveyList = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const mocSurvey = mocSurveyStore.use.mocSurvey();
  const mocSurveys = mocSurveyStore.use.mocSurveys();
  const filter = mocSurveyStore.use.filter();
  const findResponse = mocSurveyStore.use.findResponse();

  const select = (mocSurvey: types.MocSurvey) => {
    mocSurveyStore.setState({ isWriteMode: false });
    if (!self) return mocSurveyStore.setState({ mocSurvey });
    // const wallet = self.keyring?.wallets.find(
    //   (wallet) => wallet.network.provider === mocSurvey.contract.network.provider
    // );
    const item = self.items.find((item) => item.thing.id === mocSurvey.thing.id);
    if (!item) return mocSurveyStore.setState({ mocSurvey });
    const response = findResponse(mocSurvey.id, self.id);
    walletStore.setState({ wallet });
    mocSurveyStore.setState({ mocSurvey, ...(response ?? types.defaultUserSurveyResponse) });
  };

  useEffect(() => {
    if (!self?.keyring) return;
    walletStore.setState({ wallet: self.keyring.wallets[0] });
  }, [self?.keyring]);

  const getFilter = (mocSurvey: types.MocSurvey) =>
    (filter === "all" && ["opened", "closed"].includes(mocSurvey.status)) ||
    (filter === "active" && checkIsActiveSurvey(mocSurvey.status, mocSurvey.closeAt));

  return (
    <>
      <SurveyListContainer className="only-pc">
        {[...mocSurveys.filter((mocSurvey) => getFilter(mocSurvey))].reverse().map((sv, index) => (
          <Survey.Item
            key={index}
            closeAt={sv.closeAt}
            openAt={sv.openAt}
            opened={sv.status === "opened"}
            title={sv.title}
            myDao={
              (self && self.keyring && self.keyring.wallets.some((wallet) => wallet.id === sv.creator.id)) ?? false
            }
            voted={
              (self &&
                self.keyring &&
                self.keyring.wallets.some((wallet) => utils.isVoted(mocSurveys, sv.id, self?.id))) ??
              false
            }
            selected={sv === mocSurvey}
            onClick={() => select(sv)}
          />
        ))}
      </SurveyListContainer>
      <SurveyListContainer className="only-mobile">
        <Accordion allowZeroExpanded>
          {mocSurveys &&
            mocSurveys
              .filter((mocSurvey) => getFilter(mocSurvey))
              .map((sv, index) => (
                <div key={index}>
                  <AccordionItem uuid={`item${index}`}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <Survey.Item
                          key={index}
                          closeAt={sv.closeAt}
                          openAt={sv.openAt}
                          opened={sv.status === "opened"}
                          title={sv.title}
                          myDao={
                            (self &&
                              self.keyring &&
                              self.keyring.wallets.some((wallet) => wallet.id === sv.creator.id)) ??
                            false
                          }
                          voted={
                            (self &&
                              self.keyring &&
                              self.keyring.wallets.some((wallet) => utils.isVoted(mocSurveys, sv.id, self?.id))) ??
                            false
                          }
                          selected={sv === mocSurvey}
                          onClick={() => select(sv)}
                        />
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>{sv === mocSurvey && <SurveyMobileDetail />}</AccordionItemPanel>
                  </AccordionItem>
                </div>
              ))}
        </Accordion>
      </SurveyListContainer>
    </>
  );
};

const SurveyListContainer = styled.div`
  overflow-y: auto;
  /* height: calc(100vh - 130px); */
  flex: 1;
  position: relative;
`;
