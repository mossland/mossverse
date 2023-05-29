"use client";
import * as Raffle from "./_client";
import { AiOutlineAccountBook } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { cnst } from "@util/client";
import { fetch, st } from "@platform/client";

export const Menu: DataMenuItem = {
  key: "receipt",
  label: "Receipt",
  icon: <AiOutlineAccountBook />,
  render: () => <Raffle.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "raffle",
  queryMap = fetch.raffleQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.RaffleSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalRaffle"]}
      hidePresents={hidePresents}
    />
  );
};

interface RequestProps {
  id: string;
}
export const Request = ({ id }: RequestProps) => {
  return (
    <button
      className={`w-full mt-[20px] mb-[24px] p-[8px] border-solid border-[2px] text-center text-[22px] rounded-md text-black border-[#000] bg-primary  disabled:cursor-not-allowed disabled:bg-[#ddd] disabled:opacity-50`}
      onClick={() => st.do.requestRaffle()}
    >
      참여
    </button>
  );
};

interface ShipInfoProps {
  status: cnst.RaffleStatus;
  raffleId: string;
}
export const ShipInfo = ({ status, raffleId }: ShipInfoProps) => {
  return (
    <button
      className="btn btn-ghost gap-2 flex text-[12px] text-gray-500  pl-0 hover:opacity-50"
      onClick={async () => {
        st.do.viewRaffle(raffleId);
      }}
    >
      자세히보기
      <BiChevronRight className="text-[12px] md:text-[16px]" />
    </button>
  );
};

interface SubmitProps {
  raffleId: string;
  disabled: boolean;
}
export const Submit = ({ raffleId, disabled }: SubmitProps) => {
  return (
    <button
      disabled={disabled}
      className={`w-full mt-[20px] mb-[24px] p-[8px] border-solid border-[2px] text-center text-[22px] rounded-md text-black border-[#000] bg-primary  disabled:cursor-not-allowed disabled:bg-[#ddd] disabled:opacity-50`}
      onClick={async () => {
        st.do.addWinnerShipInfo(raffleId);
        st.do.showMessage({ content: "정보 제출 완료.", type: "success" });
      }}
    >
      제출
    </button>
  );
};
