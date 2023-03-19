import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataListContainer, DataTableList, WindowHeader, InventoryIcon } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Ownership from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import Image from "next/image";

export const OwnershipList = ({
  slice = st.slice.ownership,
  init,
}: ModelsProps<slice.OwnershipSlice, gql.Ownership>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Ownership.Item}
      renderDashboard={Ownership.Stat}
      // queryMap={gql.ownershipQueryMap}
      edit={
        <DataEditModal slice={slice} renderTitle={(ownership: DefaultOf<gql.Ownership>) => `${ownership.id}`}>
          <Ownership.Edit slice={slice} />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(ownership: gql.LightOwnership, idx) => [
        "remove",
        "edit",
        { type: "approve", render: () => <Ownership.Action.Approve ownership={ownership} idx={idx} slice={slice} /> },
      ]}
    />
  );
};

// ! 샘플용 리스트입니다. 수정 또는 삭제가 필요합니다.
const OwnershipListInSelf = ({
  slice = st.slice.ownership,
  self,
}: {
  slice?: slice.OwnershipSlice;
  self: gql.User;
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
      onItemClick={(ownership: gql.LightOwnership) => Router.push(`ownership/${ownership.id}`)}
    />
  );
};
OwnershipList.InSelf = OwnershipListInSelf;

interface OwnershipListInventoryProps {
  slice?: slice.OwnershipSlice;
}

export const OwnershipListInventory = ({ slice = st.slice.ownership }: OwnershipListInventoryProps) => {
  const ownershipList = slice.use.ownershipList();
  return (
    <div className="z-[3] w-[95%] md:w-[394px] border-[3px] border-solid border-black rounded-md mr-3">
      <WindowHeader title="Inventory" type="reduce" close={() => slice.do.setOwnershipModal(null)} />
      <div className="z-[2] rounded-b-md  overflow-y-auto overflow-x-hidden content-center justify-center bg-white bg-opacity-50 backdrop-blur-md p-[14px]">
        <div className="grid grid-cols-4">
          {ownershipList !== "loading" &&
            ownershipList.map((ownership, idx) => (
              <button className="flex items-center justify-center inventoryDot w-[84px] h-[84px] md:w-[91px] md:h-[91px]">
                {/* <img className="w-full h-full" src={ownership.getImageUrl()} alt="ownership" /> */}
              </button>
            ))}
          {ownershipList !== "loading" &&
            Array(16 - ownershipList.length > 0 ? 16 - ownershipList.length : 4 - (ownershipList.length % 4))
              .fill("")
              .map((a, index) => (
                <div className="inventoryDot w-[84px] h-[84px] md:w-[91px] md:h-[91px]">
                  <div className="w-full h-full" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

OwnershipList.Inventory = OwnershipListInventory;
