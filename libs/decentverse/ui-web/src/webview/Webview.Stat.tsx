import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const WebviewStat = ({
  className,
  summary,
  slice = st.slice.webview,
  queryMap = gql.webviewQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.WebviewSlice, gql.WebviewSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalWebview"]}
      hidePresents={hidePresents}
    />
  );
};
