import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime, InventoryIcon } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@shared/data-access";
import { Input, Modal } from "antd";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.OwnershipSlice;
  ownership: gql.LightOwnership;
  idx?: number;
}
export const Approve = ({ slice = st.slice.ownership, ownership, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processOwnership(ownership.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};

// ! 샘플 액션(모달 상세버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface DenyProps {
  slice?: slice.OwnershipSlice;
  ownership: gql.LightOwnership;
  idx?: number;
}
export const Deny = ({ slice = st.slice.ownership, ownership, idx }: DenyProps) => {
  const ownershipForm = slice.use.ownershipForm();
  const ownershipModal = slice.use.ownershipModal();
  return (
    <>
      <button
        className="gap-2 btn btn-primary"
        onClick={() => slice.do.editOwnership(ownership.id, { modal: `deny-${ownership.id}` })}
      >
        <CheckCircleOutlined />
        Deny
      </button>
      <Modal
        key={ownership.id}
        width="80%"
        open={ownershipModal === `deny-${ownership.id}`}
        onCancel={() => slice.do.resetOwnership()}
        // onOk={() => slice.do.denyOwnership(ownership.id, idx)}
        okButtonProps={{ disabled: false }}
      >
        <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
          <h3>{ownership.id}</h3>
        </div>
        <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
          <div>{ownership.status}</div>
          <RecentTime
            date={ownership.createdAt}
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

export const InventoryPreview = () => {
  return (
    <button
      className="bg-white rounded-md px-[11px] py-[12px] cursor-pointer duration-500 mr-3 z-[1] ml-1 border-[3px] border-solid border-black hover:opacity-50 "
      onClick={() => st.do.setOwnershipModalInItem("open")}
    >
      <InventoryIcon />
    </button>
  );
};
