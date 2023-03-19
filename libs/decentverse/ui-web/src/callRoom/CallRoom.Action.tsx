import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.CallRoomSlice;
  callRoom: gql.LightCallRoom;
  idx?: number;
}
export const Approve = ({ slice = st.slice.callRoom, callRoom, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      // onClick={() => slice.do.processCallRoom(callRoom.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};
