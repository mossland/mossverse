import { gql, st, slice, useLocale } from "@platform/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const ReceiptStat = ({
  className,
  summary,
  slice = st.slice.receipt,
  // queryMap = gql.receiptQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.ReceiptSlice, gql.ReceiptSummary>) => {
  return (
    //!wip
    <></>
    // <DataDashboard
    //   className={className}
    //   summary={summary}
    //   slice={slice}
    //   queryMap={queryMap}
    //   columns={["totalReceipt"]}
    //   hidePresents={hidePresents}
    // />
  );
};
