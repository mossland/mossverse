import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as Admin from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { ForkOutlined } from "@ant-design/icons";

export const AdminList = ({ slice = st.slice.admin, init }: ModelsProps<slice.AdminSlice, gql.Admin>) => {
  const me = st.use.me();

  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={Admin.Item}
      renderDashboard={Admin.Stat}
      queryMap={gql.adminQueryMap}
      edit={
        <DataEditModal slice={slice} renderTitle={(admin: DefaultOf<gql.Admin>) => `${admin.accountId}`}>
          <Admin.Edit slice={slice} />
        </DataEditModal>
      }
      columns={["accountId", "roles"]}
      actions={(admin: gql.Admin, idx) => [
        "edit",
        "remove",
        ...(me.hasAccess("admin") && admin.id !== me.id
          ? [{ type: "admin", render: () => <Admin.Action.ManageAdminRole admin={admin} slice={slice} idx={idx} /> }]
          : []),
        ...(me.hasAccess("superAdmin") && admin.id !== me.id
          ? [
              {
                type: "superAdmin",
                render: () => <Admin.Action.ManageSuperAdminRole admin={admin} slice={slice} idx={idx} />,
              },
            ]
          : []),
      ]}
    />
  );
};
