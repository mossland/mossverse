"use client";
import { AiOutlineLeft } from "react-icons/ai";
import { Link } from "@shared/client";
import { MocSurvey, fetch, st } from "@mossland/client";
import { useEffect } from "react";

export default function Page() {
  const self = st.use.self();
  const mocSurveyForm = st.use.mocSurveyForm();
  useEffect(() => {
    st.do.newMocSurvey({ creator: self });
  }, [self]);
  return (
    <div className="flex-1  overflow-auto border-l-[2px] ">
      <div className="px-[10px] py-[20px] overflow-auto">
        <div className="relative text-[24px] flex items-center justify-center text-center pb-[18px] ">
          <div className="relative text-[24px] text-center pb-[18px]">Create a new proposal</div>
          <Link href="/survey">
            <button
              className="absolute  cursor-pointer border-0 text-[24px] left-0 top-0 bg-transparent"
              onClick={() => st.do.resetMocSurvey()}
            >
              <AiOutlineLeft />
            </button>
          </Link>
        </div>
        <MocSurvey.Edit.InUserForm />
        <MocSurvey.Util.CreateButton disabled={!fetch.MocSurvey.creatable(mocSurveyForm as fetch.MocSurvey)} />
      </div>
    </div>
  );
}
