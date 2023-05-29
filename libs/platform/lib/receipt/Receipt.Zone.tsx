"use client";
import * as Receipt from "./_client";
import { DataEditModal, DataListContainer, LoadUnits, Modal, Skeleton } from "@shared/client";
import { ModelsProps, ServerInit } from "@util/client";
import { fetch, st } from "@platform/client";
import dayjs from "dayjs";
export const Admin = ({ sliceName = "receipt", init }: ModelsProps<fetch.Receipt>) => {
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
      sliceName={sliceName}
      // type="card"
      renderItem={Receipt.Unit.Admin}
      renderDashboard={Receipt.Util.Stat}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(receipt: fetch.Receipt) => `${receipt.id}`}>
          <Receipt.Edit.General sliceName={sliceName} />
        </DataEditModal>
      }
      columns={["type", "entryLimit", "closeAt", "announceAt"]}
      actions={(receipt: fetch.LightReceipt, idx) => ["remove", "edit"]}
    />
  );
};
interface AbstractProps {
  init: ServerInit<"receipt", fetch.LightReceipt>;
}
export const Abstract = ({ init }: AbstractProps) => {
  const receipt = st.use.receipt();
  const receiptModal = st.use.receiptModal();
  return (
    <>
      <LoadUnits
        init={init}
        renderItem={(receipt) => (
          <div key={receipt.id} onClick={() => st.do.viewReceipt(receipt.id)}>
            <Receipt.Unit.Abstract receipt={receipt} />
          </div>
        )}
      />
      <Modal
        open={!!receiptModal}
        onCancel={() => st.do.resetReceipt()}
        onOk={() => st.do.resetReceipt()}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {receipt === "loading" ? <Skeleton active /> : <Receipt.View.General receipt={receipt} />}
      </Modal>
    </>
  );
};
