import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const AssetStat = ({
  className,
  summary,
  slice = st.slice.asset,
  queryMap = gql.assetQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.AssetSlice, gql.AssetSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalAsset"]}
      hidePresents={hidePresents}
    />
  );
};
