import { AiOutlineMore } from "react-icons/ai";
import { Card, Dropdown } from "@shared/client";
import { DataAction, DataColumn, Utils } from "@util/client";
import { DataHandleAction } from "./DataHandleAction";
import { convToAntdColumn } from "./DataColumn";
import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";

export interface DataItemProps<T extends string, M extends { id: string }, L extends { id: string }> {
  className?: string;
  model: L;
  sliceName: T;
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
    sliceName,
    onClick,
    title,
    actions = [],
    columns = [],
    children,
  }: DataItemProps<T, M, L>) => {
    const strActions = actions
      .filter((action) => typeof action === "string")
      .map((action, idx) => (
        <DataHandleAction key={idx} action={action} outline={false} model={model} sliceName={sliceName} />
      ));

    const customActions = actions
      .filter((action) => typeof action !== "string")
      .map((action, idx) => ({
        key: idx,
        label: typeof action !== "string" ? action.render() : null,
      }));

    const cols = columns.map((column, idx) => {
      const key = typeof column === "string" ? column : column.key;
      const render = convToAntdColumn(column).render ?? ((v: any, m: any, i: number) => Utils.prettyPrint(v));
      return (
        <div key={idx} className="flex-wrap overflow-hidden ">
          {convToAntdColumn(column).render ? (
            render(model[key], model, idx)
          ) : (
            <>
              {key}: {model[key]}
            </>
          )}
          {/* {key}: {render(model[key], model, idx)} */}
        </div>
      );
    });
    return (
      <Card
        className={twMerge("mx-1 h-full", className)}
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
              <Dropdown
                buttonClassName="btn btn-square btn-ghost"
                value={<AiOutlineMore />}
                content={customActions.map((action) => (
                  <div key={action.key}>{action.label}</div>
                ))}
              />
            </div>
          ) : null}
        </div>
      </Card>
    );
  }
);
