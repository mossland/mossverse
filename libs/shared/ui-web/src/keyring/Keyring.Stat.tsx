import { gql, st, slice } from "@shared/data-access";
import { DataDashboard } from "@shared/ui-web";
import { ModelDashboardProps } from "@shared/util-client";

export const KeyringStat = ({
  summary,
  slice = st.slice.keyring,
  queryMap = gql.keyringQueryMap,
  hidePresents,
}: ModelDashboardProps<slice.KeyringSlice, gql.KeyringSummary>) => {
  return (
    <DataDashboard
      summary={summary}
      slice={slice}
      queryMap={queryMap}
      columns={["totalKeyring", "activeKeyring", "inProgressKeyring", "resolvedKeyring"]}
      hidePresents={hidePresents}
    />
  );
};
