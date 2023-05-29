"use client";
import * as Notification from "./_client";
import { DataEditModal, DataListContainer, fetch } from "@shared/client";
import { DefaultOf, ModelsProps } from "@util/client";

export const Admin = ({ sliceName = "notification", init }: ModelsProps<fetch.Notification>) => {
  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={Notification.Unit.Admin}
      renderDashboard={Notification.Util.Stat}
      queryMap={fetch.notificationQueryMap}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={(notification: DefaultOf<fetch.Notification>) => `${notification.id}`}
        >
          <Notification.Edit.General />
        </DataEditModal>
      }
      type="list"
      columns={["status", "createdAt"]}
      actions={(notification: fetch.LightNotification, idx) => ["remove", "edit"]}
    />
  );
};
