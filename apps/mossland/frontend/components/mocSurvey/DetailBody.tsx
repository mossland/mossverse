import React, { useEffect } from "react";
import { gql, st, store } from "../../stores";
import { MocSurveyDetailBody } from "./MocSurveyDetail";
export const DetailBody = () => {
  const self = st.use.self();
  const mocSurvey = st.use.mocSurvey();
  const response = st.use.response();

  useEffect(() => {
    if (mocSurvey === "loading") return;
    const response = mocSurvey.responses.find((response) => response.user.id === self.id) ?? {
      id: "",
      num: 0,
      user: self,
      answer: "",
      selection: null,
      reason: "",
    };

    st.do.setMocSurveyResponse(response);
  }, [mocSurvey]);

  return (
    <>
      {mocSurvey === "loading" || !response ? (
        <></>
      ) : (
        <>
          <div className="m-2">
            <hr className="border-gray-500 " />
            <div className="p-3 text-[16px] text-black">{mocSurvey.description}</div>
          </div>
          <MocSurveyDetailBody>
            {mocSurvey.type === "objective" ? (
              <MocSurveyDetailBody.ObjectiveForm
                selection={response.selection}
                selections={mocSurvey.selections}
                disabled={
                  mocSurvey.isVoted(self) ||
                  mocSurvey.status !== "opened" ||
                  !mocSurvey.isExpired() ||
                  !response.selection
                }
                onSelect={(selection) => st.set({ response: { ...response, selection } })}
              />
            ) : (
              <MocSurveyDetailBody.SubjectiveForm
                answer={response.answer}
                disabled={mocSurvey.isVoted(self) || mocSurvey.status !== "opened" || !mocSurvey.isExpired()}
                onChange={(answer) => st.set({ response: { ...response, answer } })}
              />
            )}
            <>
              <MocSurveyDetailBody.Wrapper className="hidden md:block">
                <MocSurveyDetailBody.ButtonWrapper>
                  <MocSurveyDetailBody.SurveyButton onClick={() => st.do.setMocSurvey("loading")}>
                    Close
                  </MocSurveyDetailBody.SurveyButton>
                  <MocSurveyDetailBody.SurveyButton
                    className={"bg-[#66fef1]"}
                    onClick={async () => await st.do.responseMocSurvey()}
                    disabled={
                      mocSurvey.isVoted(self) ||
                      mocSurvey.status !== "opened" ||
                      !mocSurvey.isExpired() ||
                      (mocSurvey.type === "subjective" && (!response.answer || response.answer.length < 3)) ||
                      (mocSurvey.type === "objective" && !response.selection)
                    }
                  >
                    Submit
                  </MocSurveyDetailBody.SurveyButton>
                </MocSurveyDetailBody.ButtonWrapper>
              </MocSurveyDetailBody.Wrapper>
              <MocSurveyDetailBody.Wrapper className="block md:hidden">
                <MocSurveyDetailBody.ButtonWrapper className="justify-between items-between">
                  <MocSurveyDetailBody.SurveyButton onClick={() => st.do.setMocSurvey("loading")}>
                    Close
                  </MocSurveyDetailBody.SurveyButton>
                  <MocSurveyDetailBody.SurveyButton
                    className={"bg-[#66FEF1]"}
                    onClick={async () => await st.do.responseMocSurvey()}
                    disabled={
                      mocSurvey.isVoted(self) ||
                      mocSurvey.status !== "opened" ||
                      !mocSurvey.isExpired() ||
                      (mocSurvey.type === "subjective" && (!response.answer || response.answer.length < 3)) ||
                      (mocSurvey.type === "objective" && !response.selection)
                    }
                  >
                    Submit
                  </MocSurveyDetailBody.SurveyButton>
                </MocSurveyDetailBody.ButtonWrapper>
              </MocSurveyDetailBody.Wrapper>
            </>
          </MocSurveyDetailBody>
        </>
      )}
    </>
  );
};
