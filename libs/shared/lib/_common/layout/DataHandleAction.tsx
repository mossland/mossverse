"use client";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { DataAction, Utils } from "@util/client";
import { Popconfirm, st, usePage } from "@shared/client";

export interface DataHandleActionProps<T extends string, M extends { id: string }, L extends { id: string }> {
  action: DataAction<L>;
  model: L;
  sliceName: string;
}
export const DataHandleAction = <T extends string, M extends { id: string }, L extends { id: string }>({
  action,
  model,
  sliceName,
  outline = true,
}: DataHandleActionProps<T, M, L> & { outline?: boolean }) => {
  const { l } = usePage();
  return action === "edit" ? (
    <button
      className={`m-1 text-center btn btn-square btn-ghost btn-sm ${outline && "border-dashed btn-outline"}`}
      onClick={() => (st.slice[sliceName].do[`edit${Utils.capitalize(sliceName)}`] as any)(model.id)}
    >
      <AiOutlineEdit key={action} />
    </button>
  ) : action === "view" ? (
    <button
      className={`m-1 text-center btn btn-square btn-ghost btn-sm ${outline && "border-dashed btn-outline"}`}
      onClick={() => (st.slice[sliceName].do[`view${Utils.capitalize(sliceName)}`] as any)(model.id)}
    >
      <AiOutlineEye key={action} />
    </button>
  ) : action === "remove" ? (
    <Popconfirm
      key={action}
      title={l("shared.removeMsg")}
      onConfirm={() => (st.slice[sliceName].do[`remove${Utils.capitalize(sliceName)}`] as any)(model.id)}
    >
      <button className={`m-1 text-center btn btn-square btn-ghost btn-sm ${outline && "border-dashed btn-outline"}`}>
        <AiOutlineDelete />
      </button>
    </Popconfirm>
  ) : action.render ? (
    (action.render() as JSX.Element)
  ) : (
    <></>
  );
};
