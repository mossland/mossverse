import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const TeleportStat = ({
  className,
  summary,
  slice = st.slice.teleport,
  queryMap = gql.teleportQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.TeleportSlice, gql.TeleportSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalTeleport"]}
      hidePresents={hidePresents}
    />
  );
};
