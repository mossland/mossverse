import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Receipt from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { Utils } from "@shared/util";
import dayjs from "dayjs";

export const ReceiptList = ({ slice = st.slice.receipt, init }: ModelsProps<slice.ReceiptSlice, gql.Receipt>) => {
  return (
    <></>
    // <DataListContainer
    //   init={{
    //     ...init,
    //     default: {
    //       priceTags: [{}],
    //       announceAt: dayjs(new Date()).add(3),
    //       closeAt: dayjs(new Date()).add(1),
    //     } as any,
    //   }}
    //   slice={slice}
    //   // type="card"
    //   renderItem={Receipt.Item}
    //   renderDashboard={Receipt.Stat}
    //   edit={
    //     <DataEditModal slice={slice} renderTitle={(receipt: gql.Receipt) => `${receipt.getName()}`}>
    //       <Receipt.Edit slice={slice} />
    //     </DataEditModal>
    //   }
    //   columns={["type", "entryLimit", "closeAt", "announceAt"]}
    //   actions={(receipt: gql.LightReceipt, idx) => ["remove", "edit"]}
    // />
  );
};

// ! 샘플용 리스트입니다. 수정 또는 삭제가 필요합니다.
const ReceiptListInSelf = ({
  slice = st.slice.receipt,
  self,
}: {
  slice?: slice.ReceiptSlice;
  self: gql.shared.User;
}) => {
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
      onItemClick={(receipt: gql.LightReceipt) => Router.push(`receipt/${receipt.id}`)}
    />
  );
};
ReceiptList.InSelf = ReceiptListInSelf;
