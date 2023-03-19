import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@platform/data-access";
import { Modal } from "antd";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.RaffleSlice;
  raffle: gql.LightRaffle;
  idx?: number;
}
export const Approve = ({ slice = st.slice.raffle, raffle, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processRaffle(raffle.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};

// ! 샘플 액션(모달 상세버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface DenyProps {
  slice?: slice.RaffleSlice;
  raffle: gql.LightRaffle;
  idx?: number;
}
export const Deny = ({ slice = st.slice.raffle, raffle, idx }: DenyProps) => {
  const raffleForm = slice.use.raffleForm();
  const raffleModal = slice.use.raffleModal();
  return (
    <>
      <button
        className="gap-2 btn btn-primary"
        onClick={() => slice.do.editRaffle(raffle.id, { modal: `deny-${raffle.id}` })}
      >
        <CheckCircleOutlined />
        Deny
      </button>
      <Modal
        key={raffle.id}
        width="80%"
        open={raffleModal === `deny-${raffle.id}`}
        onCancel={() => slice.do.resetRaffle()}
        // onOk={() => slice.do.denyRaffle(raffle.id, idx)}
        okButtonProps={{ disabled: false }}
      >
        <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
          <h3>{raffle.id}</h3>
        </div>
        <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
          <div>{raffle.status}</div>
          <RecentTime
            date={raffle.createdAt}
            breakUnit="second"
            timeOption={{ dateStyle: "short", timeStyle: "short" }}
          />
        </div>
        <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
          <h3>Deny Reason</h3>
          <input className="input input-bordered" />
        </div>
      </Modal>
    </>
  );
};
