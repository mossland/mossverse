import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const TileStat = ({
  className,
  summary,
  slice = st.slice.tile,
  queryMap = gql.tileQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.TileSlice, gql.TileSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalTile"]}
      hidePresents={hidePresents}
    />
  );
};
