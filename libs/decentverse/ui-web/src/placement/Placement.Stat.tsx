import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const PlacementStat = ({
  className,
  summary,
  slice = st.slice.placement,
  queryMap = gql.placementQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.PlacementSlice, gql.PlacementSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalPlacement"]}
      hidePresents={hidePresents}
    />
  );
};
