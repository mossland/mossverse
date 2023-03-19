import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.LiveSlice;
  live: gql.LightLive;
  idx?: number;
}
export const Approve = ({ slice = st.slice.live, live, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processLive(live.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};
