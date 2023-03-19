import { gql, st, slice, useLocale } from "@shared/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const FileStat = ({
  summary,
  slice = st.slice.file,
  queryMap = gql.fileQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.FileSlice, gql.FileSummary>) => {
  return (
    <DataDashboard
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalFile"]}
      hidePresents={hidePresents}
    />
  );
};
