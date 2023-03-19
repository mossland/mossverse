import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@platform/data-access";
import { Button, Modal } from "antd";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.ReceiptSlice;
  receipt: gql.LightReceipt;
  idx?: number;
}
export const Approve = ({ slice = st.slice.receipt, receipt, idx }: ApproveProps) => {
  return (
    <Button
      icon={<NumberOutlined />}
      // onClick={() => slice.do.processReceipt(receipt.id, idx)}
    >
      Approve
    </Button>
  );
};

// ! 샘플 액션(모달 상세버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface DenyProps {
  slice?: slice.ReceiptSlice;
  receipt: gql.LightReceipt;
  idx?: number;
}
export const Deny = ({ slice = st.slice.receipt, receipt, idx }: DenyProps) => {
  const receiptForm = slice.use.receiptForm();
  const receiptModal = slice.use.receiptModal();
  return (
    <>
      <Button
        icon={<CheckCircleOutlined />}
        type="primary"
        onClick={() => slice.do.editReceipt(receipt.id, { modal: `deny-${receipt.id}` })}
      >
        Deny
      </Button>
      <Modal
        key={receipt.id}
        width="80%"
        open={receiptModal === `deny-${receipt.id}`}
        onCancel={() => slice.do.resetReceipt()}
        // onOk={() => slice.do.denyReceipt(receipt.id, idx)}
        okButtonProps={{ disabled: false }}
      >
        <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
          <h3>{receipt.id}</h3>
        </div>
        <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
          <div>{receipt.status}</div>
          <RecentTime
            date={receipt.createdAt}
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
