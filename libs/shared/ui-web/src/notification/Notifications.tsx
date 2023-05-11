import { DeleteOutlined, PlusOutlined, ScheduleOutlined } from "@ant-design/icons";
import { st, gql, slice } from "@shared/data-access";
import { DataEditModal, DataItem, DataListContainer, Field, Img } from "@shared/ui-web";
import { DataMenuItem, DefaultOf, ModelEditProps, ModelProps, ModelsProps } from "@shared/util-client";

export const NotificationMenuItem: DataMenuItem = {
  key: "notification",
  label: "Notification",
  icon: <ScheduleOutlined />,
  render: () => <Notifications />,
};

export const Notifications = ({
  slice = st.slice.notification,
  init,
}: ModelsProps<slice.NotificationSlice, gql.Notification>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      edit={<NotificationEdit slice={slice} />}
      queryMap={gql.notificationQueryMap}
      //  renderDashboard={NotificationDashboard}
      renderItem={Notification}
      columns={["id", "status"]}
      actions={["edit", "remove"]}
    />
  );
};
export const Notification = ({
  notification,
  slice = st.slice.notification,
  actions,
  columns,
}: ModelProps<slice.NotificationSlice, gql.LightNotification>) => {
  return (
    <DataItem
      title={`Notification ${notification.id}`}
      model={notification}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

export const NotificationEdit = ({ slice }: ModelEditProps<slice.NotificationSlice>) => {
  const notificationForm = slice.use.notificationForm();
  return (
    <DataEditModal
      slice={slice}
      renderTitle={(notification: DefaultOf<gql.Notification>) => `${notification.id ?? "New"}`}
    ></DataEditModal>
  );
};
