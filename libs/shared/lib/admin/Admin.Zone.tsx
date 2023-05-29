"use client";
import * as AdminComponent from "./_client";
import { DataEditModal, DataListContainer, LoadUnits, LoadView, Modal, fetch, st } from "@shared/client";
import { DefaultOf, ModelsProps, ServerInit, ServerView } from "@util/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "admin", init }: ModelsProps<fetch.Admin>) => {
  const me = st.use.me();

  return (
    <DataListContainer
      init={init}
      sliceName={sliceName}
      renderItem={AdminComponent.Unit.Admin}
      renderDashboard={AdminComponent.Util.Stat}
      queryMap={fetch.adminQueryMap}
      edit={
        <DataEditModal sliceName={sliceName} renderTitle={(admin: DefaultOf<fetch.Admin>) => `${admin.accountId}`}>
          <AdminComponent.Edit.General />
        </DataEditModal>
      }
      columns={["accountId", "roles"]}
      actions={(admin: fetch.Admin, idx) => [
        "edit",
        "remove",
        ...(me.hasAccess("admin") && admin.id !== me.id
          ? [{ type: "admin", render: () => <AdminComponent.Util.ManageAdminRole id={admin.id} roles={admin.roles} /> }]
          : []),
        ...(me.hasAccess("superAdmin") && admin.id !== me.id
          ? [
              {
                type: "superAdmin",
                render: () => <AdminComponent.Util.ManageSuperAdminRole id={admin.id} roles={admin.roles} />,
              },
            ]
          : []),
      ]}
    />
  );
};

export const Test = ({ data }: { data: ServerInit<"admin", fetch.LightAdmin> }) => {
  const adminModal = st.use.adminModal();

  return (
    <div>
      {/* {renderAdminList.map((admin) => (
        <AdminComponent.Unit.General key={admin.id} admin={admin} />
      ))} */}
      <LoadUnits
        init={data}
        renderItem={(admin) => (
          <div>
            <AdminComponent.Unit.General key={admin.id} admin={admin} href={`/spaces/${admin.id}`} />
          </div>
        )}
      />
      <Modal open={!!adminModal} onCancel={() => st.do.setAdminModal(null)}>
        {adminModal}
      </Modal>
    </div>
  );
};

export const View = ({ view }: { view: ServerView<"admin", fetch.Admin> }) => {
  const admin = st.use.admin();
  useEffect(() => {
    setTimeout(() => {
      st.set({ admin: Object.assign({}, st.get().admin, { status: "asdfd" }) });
    }, 3000);
  }, []);
  return <LoadView view={view} renderView={(admin) => <AdminComponent.View.General admin={admin} />} />;
};
