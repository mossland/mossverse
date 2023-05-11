import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface ApproveProps {
  slice?: slice.AssetSlice;
  asset: gql.LightAsset;
  idx?: number;
}
export const Approve = ({ slice = st.slice.asset, asset, idx }: ApproveProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processAsset(asset.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};
