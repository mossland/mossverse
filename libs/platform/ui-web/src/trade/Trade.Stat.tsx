import { gql, st, slice, useLocale } from "@platform/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const TradeStat = ({
  className,
  summary,
  slice = st.slice.trade,
  // queryMap = gql.tradeQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.TradeSlice, gql.TradeSummary>) => {
  return (
    //!wip
    <div></div>
    // <DataDashboard
    //   className={className}
    //   summary={summary}
    //   slice={slice}
    //   queryMap={queryMap}
    //   columns={["totalTrade"]}
    //   hidePresents={hidePresents}
    // />
  );
};
