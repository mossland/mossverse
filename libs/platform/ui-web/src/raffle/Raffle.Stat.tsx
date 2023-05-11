import { gql, st, slice, useLocale } from "@platform/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const RaffleStat = ({
  className,
  summary,
  slice = st.slice.raffle,
  // queryMap = gql.raffleQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.RaffleSlice, gql.RaffleSummary>) => {
  return (
    //!wip
    <></>
    // <DataDashboard
    //   className={className}
    //   summary={summary}
    //   slice={slice}
    //   queryMap={queryMap}
    //   columns={["totalRaffle"]}
    //   hidePresents={hidePresents}
    // />
  );
};
