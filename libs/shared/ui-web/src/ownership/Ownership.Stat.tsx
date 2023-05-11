import { gql, st, slice, useLocale } from "@shared/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const OwnershipStat = ({
  className,
  summary,
  slice = st.slice.ownership,
  queryMap,
  hidePresents,
}: ModelDashboardProps<slice.OwnershipSlice, gql.OwnershipSummary>) => {
  return (
    <></>
    // <DataDashboard
    //   className={className}
    //   summary={summary}
    //   slice={slice}
    //   queryMap={queryMap}
    //   columns={["totalOwnership"]}
    //   hidePresents={hidePresents}
    // />
  );
};
