import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { RecentTime } from "@shared/ui-web";
import { twMerge } from "tailwind-merge";

interface CollisionViewProps {
  className?: string;
  collision: gql.Collision;
  slice?: slice.CollisionSlice;
}
// View를 작성하세요. 텍스트는 locale을 등록하여 사용하고, 내부 구현은 자유롭게 진행합니다.
export const CollisionView = ({ className, collision, slice = st.slice.collision }: CollisionViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("collision.id")}-{collision.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{collision.status}</div>
        <RecentTime
          date={collision.createdAt}
          breakUnit="second"
          timeOption={{ dateStyle: "short", timeStyle: "short" }}
        />
      </div>
    </div>
  );
};
