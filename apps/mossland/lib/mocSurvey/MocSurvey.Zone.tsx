"use client";
import * as MocSurvey from "./_client";

import { BiChevronLeft } from "react-icons/bi";
import { DataEditModal, DataListContainer, LoadUnits } from "@shared/client";
import { DefaultOf, ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@mossland/client";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export const Admin = ({ sliceName = "mocSurvey", init }: ModelsProps<fetch.MocSurvey>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={MocSurvey.Unit.Admin}
      renderDashboard={MocSurvey.Util.Stat}
      queryMap={fetch.mocSurveyQueryMap}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={(mocSurvey: DefaultOf<fetch.MocSurvey>) => `${mocSurvey.title}`}
        >
          <MocSurvey.Edit.General sliceName={sliceName} />
        </DataEditModal>
      }
      type="list"
      columns={["title", "status", "createdAt"]}
      actions={(mocSurvey: fetch.LightMocSurvey, idx) => [
        "remove",
        "edit",
        ...(mocSurvey.status === "applied"
          ? [
              {
                type: "approve",
                render: () => <MocSurvey.Util.Open mocSurvey={mocSurvey} idx={idx} sliceName={sliceName} />,
              },
            ]
          : []),
      ]}
    />
  );
};

interface ListProps {
  className?: string;
  init: ServerInit<"mocSurvey", fetch.LightMocSurvey>;
}

export const List = ({ className, init }: ListProps) => {
  const self = st.use.self();
  const survey = st.use.mocSurvey();
  return (
    <LoadUnits
      className={className}
      init={init}
      renderItem={(mocSurvey: fetch.LightMocSurvey) => (
        <button className={twMerge("w-full")} onClick={() => st.do.viewMocSurvey(mocSurvey.id)}>
          {/* <div className="hidden md:block"> */}
          <MocSurvey.Unit.Grid
            className={` ${mocSurvey.isActive(self) ? "bg-white" : "bg-black opacity-20"} ${
              survey !== "loading" && survey.id === mocSurvey.id
                ? "border-[#000] bg-[#E8E8E8] opacity-100 z-[10]"
                : "border-[#9a9a9a] bg-white z-[0]"
            }
          `}
            key={mocSurvey.id}
            mocSurvey={mocSurvey}
          />
          {/* </div> */}
          {/* <div className="block md:hidden">
            <Accordion allowZeroExpanded>
              <AccordionItem uuid={`item${mocSurvey.id}`}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <MocSurvey.Unit.Grid mocSurvey={mocSurvey} />
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <>
                    <MocSurvey.View.InUserForm mocSurvey={mocSurvey as fetch.MocSurvey} />
                    <MocSurvey.Edit.Answer />
                    <div className="mt-5">
                      <div className="flex justify-between">
                        <MocSurvey.Util.CloseButton />
                        <MocSurvey.Util.SubmitButton
                          mocSurvey={mocSurvey as fetch.MocSurvey}
                          disabled={
                            mocSurvey.isVoted(self) ||
                            !mocSurvey.isExpired() ||
                            mocSurvey.status !== "surveying" ||
                            (mocSurvey.type === "subjective" && (!response.answer || response.answer.length < 3)) ||
                            (mocSurvey.type === "objective" && response.selection === null)
                          }
                        />
                      </div>
                    </div>
                  </>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div> */}
        </button>
      )}
    />
  );
};

export const UserView = () => {
  const self = st.use.self();
  const mocSurvey = st.use.mocSurvey();
  const mocSurveyForm = st.use.mocSurveyForm();
  const mocSurveyModal = st.use.mocSurveyModal();
  const response = st.use.mocSurveyResponse();

  return (
    <div>
      {mocSurveyModal === "view" && mocSurvey !== "loading" ? (
        <>
          <MocSurvey.View.InUserForm mocSurvey={mocSurvey} />
          <MocSurvey.Edit.Answer />
          <div className="mt-5">
            <div className="flex justify-between m-5">
              <MocSurvey.Util.CloseButton />
              <MocSurvey.Util.SubmitButton
                mocSurvey={mocSurvey}
                disabled={
                  !mocSurvey.isActive(self) ||
                  (mocSurvey.type === "subjective" && (!response.answer || response.answer.length < 3)) ||
                  (mocSurvey.type === "objective" && response.selection === null)
                }
              />
            </div>
          </div>
        </>
      ) : mocSurveyModal === "edit" && mocSurvey === "loading" ? (
        <div className="p-5">
          <div className="relative text-2xl flex items-center justify-center text-center pb-[18px] ">
            <button onClick={() => st.do.resetMocSurvey()} className="absolute top-0 left-0 hover:cursor-pointer">
              <BiChevronLeft className="inline-block mr-2" />
            </button>
            <div className="relative text-2xl text-center">Create a new proposal</div>
          </div>
          <MocSurvey.Edit.InUserForm />
          <MocSurvey.Util.CreateButton disabled={!fetch.MocSurvey.creatable(mocSurveyForm as fetch.MocSurvey)} />
        </div>
      ) : (
        <button
          onClick={() => st.do.newMocSurvey({ openAt: dayjs().add(1, "day"), closeAt: dayjs().add(3, "month") })}
          className="fixed rounded-[6px] border-2 border-solid border-black bg-[#FFE177] text-[22px] leading-5 w-[95%] py-6 right-0 bottom-0 flex items-center justify-center md:mx-[20px] md:w-[47%] mb-[10px]"
        >
          Create a new propsal
        </button>
      )}
    </div>
  );
};
