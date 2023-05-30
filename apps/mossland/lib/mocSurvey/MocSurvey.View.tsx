import { ActiveTag } from "../../client";
import { RecentTime, SurveyIcon } from "@shared/client";
import { fetch, usePage } from "@mossland/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  mocSurvey: fetch.MocSurvey;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const General = ({ className, mocSurvey }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("mocSurvey.id")}-{mocSurvey.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{mocSurvey.status}</div>
        <RecentTime
          date={mocSurvey.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};

interface MocSurveyViewInUserFormProps {
  className?: string;
  mocSurvey: fetch.MocSurvey;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const InUserForm = ({ className, mocSurvey }: MocSurveyViewInUserFormProps) => {
  const { l } = usePage();
  return (
    <>
      <div className="px-[18px] py-[22px]">
        <div className="flex">
          <SurveyIcon />
          <div className="font-normal text-[24px] leading-6 ml-2 mb-[30px]">{mocSurvey.title}</div>
        </div>
        <div className="flex items-center justify-end">
          {mocSurvey.status === "surveying" && mocSurvey.isExpired() && <ActiveTag />}
          <div className="font-normal text-end justify-end leading-4 text-[16px]">
            {mocSurvey.openAt.format("YYYY-MM-DD")} ~ {mocSurvey.closeAt.format("YYYY-MM-DD")}
          </div>
        </div>
      </div>
      <div className="m-2">
        <hr className="border-gray-500 " />
        <div className="p-3 text-[16px] text-black">{mocSurvey.description}</div>
      </div>
    </>
  );
};
