import React, { useEffect } from "react";
import { st } from "../../stores";
import { DetailMobile } from ".";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { SurveyIcon } from "@shared/ui-web";
import { Item } from "./";
import { MocSurveyList } from "./MocSurveyList";

export const List = () => {
  const mocSurvey = st.use.mocSurvey();
  const mocSurveyList = st.use.mocSurveyList();

  return (
    <>
      {mocSurveyList === "loading" ? (
        <></>
      ) : (
        <>
          <MocSurveyList className="hidden md:block">
            {mocSurveyList.map((sv, index) => (
              <Item key={index} survey={sv} />
            ))}
          </MocSurveyList>
          <MocSurveyList className="block md:hidden">
            <Accordion allowZeroExpanded>
              {mocSurveyList.map((sv, index) => (
                <div key={index}>
                  <AccordionItem uuid={`item${index}`}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <Item survey={sv} />
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      {mocSurvey !== "loading" && sv.id === mocSurvey.id && <DetailMobile />}
                    </AccordionItemPanel>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </MocSurveyList>
        </>
      )}
    </>
  );
};
