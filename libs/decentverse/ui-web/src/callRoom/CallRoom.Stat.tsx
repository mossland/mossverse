import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const CallRoomStat = ({
  className,
  summary,
  slice = st.slice.callRoom,
  queryMap = gql.callRoomQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.CallRoomSlice, gql.CallRoomSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalCallRoom"]}
      hidePresents={hidePresents}
    />
  );
};
