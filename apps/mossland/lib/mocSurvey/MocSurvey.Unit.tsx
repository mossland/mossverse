import { Common } from "../../client";
import { DataItem, SurveyIcon } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@mossland/client";
import { twMerge } from "tailwind-merge";

export const Admin = ({
  className,
  mocSurvey,
  sliceName = "mocSurvey",
  actions,
  columns,
}: ModelProps<"mocSurvey", fetch.LightMocSurvey>) => {
  return (
    <DataItem
      className={className}
      title={`${mocSurvey.title}`}
      model={mocSurvey}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

type GridProps = {
  className?: string;
  mocSurvey: fetch.LightMocSurvey;
};

export const Grid = ({ className, mocSurvey }: GridProps) => {
  return (
    <div
      className={twMerge(
        "relative mt-[-2px] flex justify-between p-[18px] h-[92px] w-full   border-t-2 border-b-2 border-solid transition duration-500",
        className
      )}
    >
      <div className="flex gap-2 w-[40%]">
        <SurveyIcon />
        <div className="truncate ">{mocSurvey.title}</div>
      </div>
      <div className="flex w-[60%] flex-col-reverse md:items-end md:flex">
        <div className="flex justify-end w-full mt-2">
          {mocSurvey.status === "surveying" && mocSurvey.isExpired() && <Common.ActiveTag />}
        </div>
        <div className="text-end notitalic justify-end text-[16px] leading-4">
          {mocSurvey.openAt.format("YYYY-MM-DD")} ~ {mocSurvey.closeAt.format("YYYY-MM-DD")}
        </div>
      </div>
    </div>
  );
};
