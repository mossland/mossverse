import React, { ReactNode, useMemo } from "react";
import { EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Popconfirm } from "antd";
import { Utils } from "@shared/util";
import { DataAction, DataColumn, SliceModel } from "@shared/util-client";
import { DataHandleAction } from "./DataHandleAction";
import { convToAntdColumn } from "./DataColumn";
import { Card } from "@shared/ui-web";
import { twMerge } from "tailwind-merge";

interface DataItemProps<T extends string, M extends { id: string }, L extends { id: string }> {
  className?: string;
  model: L;
  slice: SliceModel<T, M, L>;
  onClick?: () => void;
  cover?: ReactNode;
  title?: ReactNode;
  actions?: DataAction<L>[];
  columns?: DataColumn<any>[];
  children?: ReactNode;
}
export const DataItem = React.memo(
  <T extends string, M extends { id: string }, L extends { id: string }>({
    className,
    model,
    cover,
    slice,
    onClick,
    title,
    actions = [],
    columns = [],
    children,
  }: DataItemProps<T, M, L>) => {
    const strActions = useMemo(
      () =>
        actions
          .filter((action) => typeof action === "string")
          .map((action, idx) => <DataHandleAction key={idx} action={action} model={model} slice={slice} />),
      [model]
    );
    const customActions = useMemo(
      () =>
        actions
          .filter((action) => typeof action !== "string")
          .map((action, idx) => ({
            key: idx,
            label: typeof action !== "string" ? action.render() : null,
          })),
      [model]
    );
    const cols = useMemo(
      () =>
        columns.map((column, idx) => {
          const key = typeof column === "string" ? column : column.key;
          const render = convToAntdColumn(column).render ?? ((v: any, m: any, i: number) => Utils.prettyPrint(v));
          return (
            <div key={idx} className="flex-wrap overflow-hidden ">
              {key}: {render(model[key], model, idx)}
            </div>
          );
        }),
      [model]
    );

    return (
      <Card
        className={twMerge("mx-1", className)}
        onClick={onClick}
        cover={cover}
        hoverable
        title={title}
        footer={
          <div className="flex w-full border-t border-gray-100">
            {strActions.map((action, idx) => (
              <div className="flex items-center justify-center flex-1 h-12 " key={idx}>
                {action}
              </div>
            ))}
          </div>
        }
      >
        {children}
        {cols}
        <div>
          {customActions.length ? (
            <div className="absolute right-1 top-1">
              <Dropdown menu={{ items: customActions }}>
                <button className="btn" onClick={() => null}>
                  <MoreOutlined />
                </button>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </Card>
    );
  }
);
