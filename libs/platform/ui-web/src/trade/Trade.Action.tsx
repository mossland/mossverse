import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@platform/data-access";
import { Input, Modal } from "antd";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.TradeSlice;
  trade: gql.LightTrade;
  idx?: number;
}
export const Approve = ({ slice = st.slice.trade, trade, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processTrade(trade.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};

// ! 샘플 액션(모달 상세버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface DenyProps {
  slice?: slice.TradeSlice;
  trade: gql.LightTrade;
  idx?: number;
}
export const Deny = ({ slice = st.slice.trade, trade, idx }: DenyProps) => {
  const tradeForm = slice.use.tradeForm();
  const tradeModal = slice.use.tradeModal();
  return (
    <>
      <button
        className="gap-2 btn btn-primary"
        onClick={() => slice.do.editTrade(trade.id, { modal: `deny-${trade.id}` })}
      >
        <CheckCircleOutlined />
        Deny
      </button>
      <Modal
        key={trade.id}
        width="80%"
        open={tradeModal === `deny-${trade.id}`}
        onCancel={() => slice.do.resetTrade()}
        // onOk={() => slice.do.denyTrade(trade.id, idx)}
        okButtonProps={{ disabled: false }}
      >
        <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
          <h3>{trade.id}</h3>
        </div>
        <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
          {/* <div>{trade.status}</div> */}
          <RecentTime
            date={trade.createdAt}
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
