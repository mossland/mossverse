import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const LiveStat = ({
  className,
  summary,
  slice = st.slice.live,
  queryMap = gql.liveQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.LiveSlice, gql.LiveSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalLive"]}
      hidePresents={hidePresents}
    />
  );
};
