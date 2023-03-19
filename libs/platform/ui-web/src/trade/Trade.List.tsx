import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Trade from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";

export const TradeList = ({ slice = st.slice.trade, init }: ModelsProps<slice.TradeSlice, gql.Trade>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Trade.Item}
      renderDashboard={Trade.Stat}
      // queryMap={gql.tradeQueryMap}
      edit={
        <DataEditModal slice={slice} renderTitle={(trade: DefaultOf<gql.Trade>) => `${trade.name}`}>
          <Trade.Edit slice={slice} />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(trade: gql.LightTrade, idx) => [
        "remove",
        "edit",
        { type: "approve", render: () => <Trade.Action.Approve trade={trade} idx={idx} slice={slice} /> },
      ]}
    />
  );
};

// ! 샘플용 리스트입니다. 수정 또는 삭제가 필요합니다.
const TradeListInSelf = ({ slice = st.slice.trade, self }: { slice?: slice.TradeSlice; self: gql.shared.User }) => {
  const { t } = useTranslation();
  if (!self.id) {
    window.alert(`로그인이 필요합니다.`);
    Router.push(pageMap.getUnauthorized());
  }
  return (
    <DataTableList
      slice={slice}
      init={{ query: { from: self.id } }}
      columns={["id", "createdAt", "status"]}
      onItemClick={(trade: gql.LightTrade) => Router.push(`trade/${trade.id}`)}
    />
  );
};
TradeList.InSelf = TradeListInSelf;
