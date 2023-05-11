import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const CollisionStat = ({
  className,
  summary,
  slice = st.slice.collision,
  queryMap = gql.collisionQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.CollisionSlice, gql.CollisionSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalCollision"]}
      hidePresents={hidePresents}
    />
  );
};
