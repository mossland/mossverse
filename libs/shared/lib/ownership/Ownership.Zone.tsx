"use client";
import * as Ownership from "./_client";
import { DataEditModal, DataListContainer, LoadView, WindowHeader, fetch, st } from "@shared/client";
import { DefaultOf, ModelsProps, ServerView } from "@util/client";

export const Admin = ({ sliceName = "ownership", init }: ModelsProps<fetch.Ownership>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Ownership.Unit.Admin}
      renderDashboard={Ownership.Util.Stat}
      // queryMap={fetch.ownershipQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(ownership: DefaultOf<fetch.Ownership>) => `${ownership.id}`}>
          <Ownership.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["type", { key: "field", render: (field: string) => <span>{field}</span> }, "status", "createdAt"]}
      actions={(ownership: fetch.LightOwnership, idx) => ["remove", "edit"]}
    />
  );
};

export const Inventory = () => {
  const ownershipMap = st.use.ownershipMap();
  return (
    <div className="z-[3] w-[95%] md:w-[394px] border-[3px] border-solid border-black rounded-md mr-3">
      <WindowHeader title="Inventory" type="reduce" close={() => st.do.setOwnershipModal(null)} />
      <div className="z-[2] rounded-b-md  overflow-y-auto overflow-x-hidden content-center justify-center bg-white bg-opacity-50 backdrop-blur-md p-[14px]">
        <div className="grid grid-cols-4">
          {ownershipMap !== "loading" &&
            [...ownershipMap.values()].map((ownership, idx) => (
              <button className="flex items-center justify-center inventoryDot w-[84px] h-[84px] md:w-[91px] md:h-[91px]">
                {/* <img className="w-full h-full" src={ownership.getImageUrl()} alt="ownership" /> */}
              </button>
            ))}
          {ownershipMap !== "loading" &&
            Array(16 - ownershipMap.size > 0 ? 16 - ownershipMap.size : 4 - (ownershipMap.size % 4))
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

interface ViewSelfProps {
  view: ServerView<"ownership", fetch.Ownership>;
}
export const ViewSelf = ({ view }: ViewSelfProps) => {
  return <LoadView view={view} renderView={(ownership) => <Ownership.View.InSelf ownership={ownership} />} />;
};
