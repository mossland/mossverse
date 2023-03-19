import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";
import { Input, Modal } from "antd";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.TeleportSlice;
  teleport: gql.LightTeleport;
  idx?: number;
}
export const Approve = ({ slice = st.slice.teleport, teleport, idx }: ApproveProps) => {
  return (
    <button
      className="btn gap-2"
      // onClick={() => slice.do.processTeleport(teleport.id, idx)}
      onClick={() => null}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};
