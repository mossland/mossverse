"use client";
import * as MocSurvey from "./_client";
import { AiOutlineNumber } from "react-icons/ai";
import { CheckIcon, DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { RiSurveyFill } from "react-icons/ri";
import { fetch, st } from "@mossland/client";

export const Menu: DataMenuItem = {
  key: "mocSurvey",
  label: "MocSurvey",
  icon: <RiSurveyFill />,
  render: () => <MocSurvey.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "mocSurvey",
  queryMap = fetch.mocSurveyQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.MocSurveySummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalMocSurvey", "appliedMocSurvey", "surveyingMocSurvey", "closedMocSurvey"]}
      hidePresents={hidePresents}
    />
  );
};

interface OpenProps {
  sliceName?: string;
  mocSurvey: fetch.LightMocSurvey;
  idx?: number;
}
export const Open = ({ sliceName = "mocSurvey", mocSurvey, idx }: OpenProps) => {
  return (
    <button
      className="h-8 gap-2 text-white btn btn-info min-h-8 "
      onClick={async () => await st.do.openMocSurvey(mocSurvey.id)}
    >
      <AiOutlineNumber />
      Open
    </button>
  );
};

interface CreateButtonProps {
  className?: string;
  disabled?: boolean;
}

export const CreateButton = ({ className, disabled }: CreateButtonProps) => {
  return (
    <button
      className={`cursor-pointer w-full h-[50px] text-[22px] border-[2px] mt-[20px] font-normal bg-[#FFE177] border-solid border-black rounded-[6px] p-[8px] text-black 
       disabled:opacity-50 disabled:cursor-default ${className}`}
      onClick={async () => {
        await st.do.applyMocSurvey();
        st.do.resetMocSurvey();
        st.do.showMessage({ content: "제안이 생성되었습니다.\n 관리자 검수후 게시됩니다." });
      }}
      disabled={disabled}
    >
      create
    </button>
  );
};

interface CloseButtonProps {
  className?: string;
}

export const CloseButton = ({ className }: CloseButtonProps) => {
  return (
    <button
      className={
        "min-h-[50px] mx-[4px] w-full text-[22px] border-solid border-[2px] border-black rounded-[10px] font-normal brightness-[1]  disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-opacity-80 bg-white"
      }
      onClick={async () => {
        st.do.resetMocSurvey();
      }}
    >
      close
    </button>
  );
};

interface SubmitButtonProps {
  className?: string;
  mocSurvey: fetch.MocSurvey;
  disabled?: boolean;
}

export const SubmitButton = ({ className, disabled }: SubmitButtonProps) => {
  return (
    <button
      onClick={async () => {
        await st.do.responseMocSurvey();
        st.do.resetMocSurvey();
        st.do.showMessage({ content: "투표에 성공했습니다.", type: "success" });
      }}
      className={
        "min-h-[50px] mx-[4px] w-full text-[22px] border-solid border-[2px] border-black rounded-[10px] font-normal brightness-[1]  disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-opacity-80 bg-[#66fef1]"
      }
      disabled={disabled}
    >
      Submit
    </button>
  );
};

export const Filter = () => {
  const mocSurveyCount = st.use.mocSurveyCount();
  const queryOfMocsurvey = st.use.queryOfMocSurvey();
  const filter = queryOfMocsurvey.status === "surveying" ? "active" : "all";
  return (
    <div className="flex gap-2 mt-[20px] ">
      <button
        className={`flex text-center justify-center border-[1px] border-solid border-black  rounded-[6px] gap-1 py-[8px] text-[14px] font-bold leading-[8px] bg-[#A0E3FF] ${
          filter !== "all" && "opacity-50"
        }`}
        onClick={() => st.do.setQueryOfMocSurvey({ status: { $ne: "inactive" } })}
      >
        <div className={`${filter === "all" ? "visible" : "invisible"}`}>
          <CheckIcon />
        </div>
        All
        <div className={`font-bold ${filter === "all" ? "visible" : "invisible"}`}>{`(${mocSurveyCount})`}</div>
      </button>
      <button
        className={`flex  text-center justify-center border-[1px] border-solid border-black  rounded-[6px] gap-1 py-[8px] text-[14px] font-bold leading-[8px] bg-[#FFE177] ${
          filter !== "active" && "opacity-50"
        }`}
        onClick={() => st.do.setQueryOfMocSurvey({ status: "surveying" })}
      >
        <div className={`${filter === "active" ? "visible" : "invisible"}`}>
          <CheckIcon />
        </div>
        Active
        <div className={`font-bold ${filter === "active" ? "visible" : "invisible"}`}>{`(${mocSurveyCount})`}</div>
      </button>
    </div>
  );
};
