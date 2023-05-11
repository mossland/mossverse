import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Utils } from "@shared/util";
import { DataAction, SliceModel } from "@shared/util-client";
import { Popconfirm } from "antd";
import { useLocale } from "@shared/data-access";

interface DataHandleActionProps<T extends string, M extends { id: string }, L extends { id: string }> {
  action: DataAction<L>;
  model: L;
  slice: SliceModel<T, M, L>;
}
export const DataHandleAction = <T extends string, M extends { id: string }, L extends { id: string }>({
  action,
  model,
  slice,
}: DataHandleActionProps<T, M, L>) => {
  const { l } = useLocale();

  return action === "edit" ? (
    <EditOutlined key={action} onClick={() => (slice.do[`edit${Utils.capitalize(slice.refName)}`] as any)(model.id)} />
  ) : action === "view" ? (
    <EyeOutlined key={action} onClick={() => (slice.do[`view${Utils.capitalize(slice.refName)}`] as any)(model.id)} />
  ) : action === "remove" ? (
    <Popconfirm
      key={action}
      title={l("main.removeMsg")}
      onConfirm={() => (slice.do[`remove${Utils.capitalize(slice.refName)}`] as any)(model.id)}
    >
      <DeleteOutlined />
    </Popconfirm>
  ) : action.render ? (
    (action.render() as JSX.Element)
  ) : (
    <></>
  );
};
