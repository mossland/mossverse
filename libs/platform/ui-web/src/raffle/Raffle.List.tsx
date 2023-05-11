import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Raffle from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { Utils } from "@shared/util";
import dayjs from "dayjs";

export const RaffleList = ({ slice = st.slice.raffle, init }: ModelsProps<slice.RaffleSlice, gql.Raffle>) => {
  return (
    <DataListContainer
      init={{
        ...init,
        default: {
          priceTags: [{}],
          announceAt: dayjs(new Date()).add(3),
          closeAt: dayjs(new Date()).add(1),
        } as any,
      }}
      slice={slice}
      // type="card"
      renderItem={Raffle.Item}
      renderDashboard={Raffle.Stat}
      edit={
        <DataEditModal slice={slice} renderTitle={(raffle: gql.Raffle) => `${raffle.getName()}`}>
          <Raffle.Edit slice={slice} />
        </DataEditModal>
      }
      columns={["type", "entryLimit", "closeAt", "announceAt"]}
      actions={(raffle: gql.LightRaffle, idx) => ["remove", "edit"]}
    />
  );
};

// ! 샘플용 리스트입니다. 수정 또는 삭제가 필요합니다.
const RaffleListInSelf = ({ slice = st.slice.raffle, self }: { slice?: slice.RaffleSlice; self: gql.shared.User }) => {
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
      onItemClick={(raffle: gql.LightRaffle) => Router.push(`raffle/${raffle.id}`)}
    />
  );
};
RaffleList.InSelf = RaffleListInSelf;
