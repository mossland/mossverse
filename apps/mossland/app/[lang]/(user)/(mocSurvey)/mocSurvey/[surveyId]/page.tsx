"use client";
import { MocSurvey, st } from "@mossland/client";
import { useEffect } from "react";

export default function Page({ params: { surveyId } }) {
  // const {mocSurveyView} = await fetch.viewMocSurvey(surveyId);
  const self = st.use.self();
  const mocSurvey = st.use.mocSurvey();
  const response = st.use.mocSurveyResponse();
  useEffect(() => {
    st.do.viewMocSurvey(surveyId);
  }, []);
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
  if (mocSurvey === "loading") return <div>loading...</div>;
  return (
    <>
      <MocSurvey.View.InUserForm mocSurvey={mocSurvey} />
      <MocSurvey.Edit.Answer />
      <div className="mt-5">
        <div className="flex justify-between">
          <MocSurvey.Util.CloseButton />
          <MocSurvey.Util.SubmitButton
            mocSurvey={mocSurvey}
            disabled={
              mocSurvey.isVoted(self) ||
              !mocSurvey.isExpired() ||
              mocSurvey.status !== "surveying" ||
              (mocSurvey.type === "subjective" && (!response.answer || response.answer.length < 3)) ||
              (mocSurvey.type === "objective" && response.selection === null)
            }
          />
        </div>
        {mocSurvey.status === "surveying" && mocSurvey.isVoted(self) && (
          <div className="p-5 text-red-500">* You have already voted.</div>
        )}
      </div>
    </>
  );
}
