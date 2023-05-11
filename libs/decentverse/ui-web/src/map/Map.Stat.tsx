import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const MapStat = ({
  className,
  summary,
  slice = st.slice.map,
  queryMap = gql.mapQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.MapSlice, gql.MapSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalMap"]}
      hidePresents={hidePresents}
    />
  );
};
