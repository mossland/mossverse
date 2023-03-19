import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";
import { useRef } from "react";

// ! 샘플 액션(심플버전)입니다. 삭제 후 커스터마이징이 필요합니다.
interface PreviewProps {
  slice?: slice.CollisionSlice;
  collision: gql.LightCollision;
  idx?: number;
}
export const Preview = ({ slice = st.slice.collision, collision, idx }: PreviewProps) => {
  return (
    <button
      className="gap-2 btn"
      onClick={() => null}
      // onClick={() => slice.do.processCollision(collision.id, idx)}
    >
      <NumberOutlined />
      Approve
    </button>
  );
};
