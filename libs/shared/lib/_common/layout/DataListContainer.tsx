"use client";
import { AiOutlineEllipsis, AiOutlinePlus, AiOutlineRedo } from "react-icons/ai";
import { Card, Dropdown, Select, Skeleton, Table, Typography, st, usePage } from "@shared/client";
import { DataAction, DataColumn, DataTool, InitActionForm, Utils } from "@util/client";
import { DataHandleAction } from "./DataHandleAction";
import { DataPagination, DataSearch } from "./DataList";
import { convToAntdColumn } from "./DataColumn";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect, useMemo } from "react";
import pluralize from "pluralize";

type SortOption<M> = { key: string; sort: { [key: string]: 1 | -1 } };
type FilterOption<M> = { key: string; query: { [key: string]: any } };
type DataItemProps<T extends string, M extends { id: string }, L extends { id: string }> = {
  [key in T]: L;
} & { sliceName: string };

export interface DataListContainerProps<T extends string, State, M extends { id: string }, L extends { id: string }> {
  className?: string;
  type?: "card" | "list";
  init?: InitActionForm<M>;
  sliceName: string;
  edit?: JSX.Element;
  view?: (props: { [key in T]: M }) => JSX.Element;
  title?: string;
  filterOptions?: FilterOption<M>[];
  sortOptions?: SortOption<M>[];
  columns?: DataColumn<any>[];
  tools?: DataTool[];
  actions?: DataAction<L>[] | ((item: L, idx: number) => DataAction<L>[]);
  queryMap?: { [key: string]: any };
  renderDashboard?: ({ summary, hidePresents }: any) => JSX.Element;
  renderItem?: (args: DataItemProps<T, M, L> & any) => ReactNode;
  renderLoading?: () => ReactNode;
}

export const DataListContainer = <T extends string, State, M extends { id: string }, L extends { id: string }>({
  className,
  type = "card",
  init,
  edit,
  view,
  sliceName,
  title,
  filterOptions = [],
  sortOptions = [],
  columns = ["id", "createdAt", "updatedAt"],
  actions,
  tools = [],
  queryMap,
  renderDashboard,
  renderItem = ({ [sliceName]: model }) => <Card title={model.id} />,
  renderLoading,
}: DataListContainerProps<T, State, M, L>) => {
  const [modelName, modelClassName] = [sliceName, Utils.capitalize(sliceName)];
  const filter = useSearchParams()?.get("filter") as string;
  const filterQuery = queryMap ? (filter ? queryMap[filter] ?? {} : {}) : {};
  const modelCount = st.slice[sliceName].use[`${modelName}Count` as any]();
  const filterOpts: FilterOption<M>[] = [...filterOptions];
  const fitlerOpt = st.slice[sliceName].use[`queryOf${modelClassName}`]();
  // const [filterOpt, selectFilter] = useState<FilterOption<M>>(filterOpts[0]);
  const sortOpts: SortOption<M>[] = [
    { key: "Newest", sort: { createdAt: -1 } as any },
    { key: "Oldest", sort: { createdAt: 1 } as any },
    ...sortOptions,
  ];
  useEffect(() => {
    st.slice[sliceName].do[`init${modelClassName}` as any]({
      ...(init ?? {}),
      query: { ...filterQuery, ...(init?.query ?? {}) },
    });
  }, [filter]);
  const { l } = usePage();
  const ModelEdit = (): JSX.Element => {
    const Edit = () => edit ?? <></>;
    return <Edit />;
  };
  const ModelView = (): JSX.Element => {
    const model = st.use[modelName as any]();
    const View = view;
    if (View && model !== "loading") return <View {...({ [modelName as any]: model } as any)} />;
    else return <></>;
  };
  const ModelDashboard = (): JSX.Element => {
    const summary = (st as any).use.summary && (st as any).use.summary();
    const Stat = renderDashboard;
    if (!Stat) return <></>;
    return (
      <div className="mb-4">
        {summary === "loading" ? <Skeleton active /> : <Stat summary={summary} hidePresents />}
      </div>
    );
  };
  return (
    <div className={twMerge("m-4", className)}>
      <div className="flex flex-wrap justify-between mb-3">
        <div className="flex pb-1">
          <Typography.Title className="" level={4}>
            {title ?? pluralize(Utils.capitalize(sliceName))} ({modelCount})
          </Typography.Title>

          {edit && (
            <div>
              <div className="ml-3">
                <button
                  onClick={() => st.slice[sliceName].do[`new${modelClassName}` as any]()}
                  className="mr-[0.5px] rounded-r-none btn btn-sm btn-primary"
                >
                  <AiOutlinePlus /> {l("shared.new")}
                </button>
                <Dropdown
                  buttonClassName="btn btn-primary btn-sm rounded-l-none"
                  value={<AiOutlineEllipsis />}
                  // content={toolMenu.items.map((item) => (
                  //   <button
                  //     onClick={item.onclick}
                  //     className="flex gap-2 font-light btn btn-ghost btn-sm"
                  //     key={item.key}
                  //   >
                  //     {item.icon}
                  //     {item.label}
                  //   </button>
                  // ))}
                  content={tools.map((tool) => tool.render())}
                />
              </div>
            </div>
          )}
        </div>
        {filterOpts.length ? (
          <div className="">
            {filterOpts.map((filterOption) => (
              <button
                key={filterOption.key}
                className={twMerge(
                  "btn px-2 mx-2 rounded-md btn-sm",
                  `${JSON.stringify(filterOption.query) === JSON.stringify(fitlerOpt) ? "btn-primary" : "btn-outline"}`
                )}
                onClick={async () =>
                  await st.slice[sliceName].do[`setQueryOf${modelClassName}` as any](filterOption.query, {
                    invalidate: true,
                  })
                }
              >
                {filterOption.key}
              </button>
            ))}
          </div>
        ) : (
          <></>
        )}
        <div className="flex">
          <button
            className="mx-1 btn btn-primary btn-sm btn-square"
            onClick={() => st.slice[sliceName].do[`refresh${modelClassName}` as any]({ invalidate: true })}
          >
            <AiOutlineRedo className="mx-2" />
          </button>
          <Select
            className="mx-1"
            defaultValue={sortOpts[0].key}
            style={{ width: 250 }}
            onChange={(key) =>
              st.slice[sliceName].do[`setSortOf${modelClassName}` as any](
                sortOpts.find((sortOpt) => sortOpt.key === key)?.sort ?? sortOpts[0].sort
              )
            }
          >
            {sortOpts.map((sortOption) => (
              <Select.Option key={sortOption.key} value={sortOption.key}>
                {sortOption.key}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      {!init?.query && <ModelDashboard />}
      {type === "card" ? (
        <DataCardList
          sliceName={sliceName}
          renderItem={renderItem}
          renderLoading={renderLoading}
          columns={columns}
          actions={actions}
        />
      ) : (
        <DataTableList columns={columns} sliceName={sliceName} actions={actions} />
      )}
      <ModelEdit />
      <ModelView />
    </div>
  );
};

export interface DataCardListProps<T extends string, M extends { id: string }, L extends { id: string }> {
  className?: string;
  init?: InitActionForm<M>;
  sliceName: string;
  columns: DataColumn<any>[];
  actions?: DataAction<L>[] | ((item: L, idx: number) => DataAction<L>[]);
  renderItem: (args: DataItemProps<T, M, L>) => ReactNode;
  renderLoading?: () => ReactNode;
}
export const DataCardList = <T extends string, M extends { id: string }, L extends { id: string }>({
  className,
  init,
  sliceName,
  actions,
  columns,
  renderItem,
  renderLoading,
}: DataCardListProps<T, M, L>) => {
  const [modelName, modelClassName] = [sliceName, Utils.capitalize(sliceName)];
  const modelMap = st.slice[sliceName].use[`${modelName}Map` as any]();
  const limitOfModel = st.slice[sliceName].use[`limitOf${modelClassName}` as any]();
  const RenderItem: any = renderItem;
  useEffect(() => {
    init && st.slice[sliceName].do[`init${modelClassName}` as any](init);
  }, []);
  return (
    <div className={className}>
      {modelMap === "loading" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {new Array(limitOfModel || 20).fill(0).map(() => (renderLoading ? renderLoading() : <Skeleton active />))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...modelMap.values()].map((model, idx) => (
            <RenderItem
              {...({
                [sliceName]: model,
                sliceName,
                actions: typeof actions === "function" ? actions(model, idx) : actions,
                columns,
                idx,
              } as DataItemProps<T, M, L>)}
            />
          ))}
        </div>
      )}
      <DataPagination sliceName={sliceName} />
    </div>
  );
};

export interface DataTableListProps<T extends string, M extends { id: string }, L> {
  className?: string;
  init?: InitActionForm<M>;
  sliceName: string;
  columns: DataColumn<any>[];
  actions?: DataAction<L>[] | ((item: L, idx: number) => DataAction<L>[]);
  onItemClick?: (item: L, idx: number) => void;
}
export const DataTableList = <T extends string, M extends { id: string }, L>({
  className,
  init,
  sliceName,
  columns,
  actions,
  onItemClick,
}: DataTableListProps<T, M, L>) => {
  const [modelName, modelClassName] = [sliceName, Utils.capitalize(sliceName)];
  const modelMap = st.slice[sliceName].use[`${modelName}Map` as any]();
  useEffect(() => {
    init && st.slice[sliceName].do[`init${modelClassName}` as any](init);
  }, []);
  const cols = useMemo(() => {
    const firstCol: any = convToAntdColumn(columns[0]);
    return [
      {
        ...firstCol,
        render: (value, model, idx) => (
          <div key={`${model.id}-${idx}`} className="flex items-center">
            <div className="mr-2">{firstCol.render ? firstCol.render(value, model, idx) : value}</div>
            {actions &&
              (typeof actions === "function" ? actions(model, idx) : actions)
                .filter((action) => typeof action === "string")
                .map((action, idx) => (
                  <DataHandleAction key={`${model.id}-${action}`} model={model} action={action} sliceName={sliceName} />
                ))}
          </div>
        ),
      },
      ...columns.slice(1).map(convToAntdColumn),
      ...(actions
        ? [
            {
              key: "actions",
              dataIndex: "id",
              title: "Actions",
              render: (_, model, idx) => (
                <div className="flex gap-1">
                  {(typeof actions === "function" ? actions(model, idx) : actions)
                    .filter((action) => typeof action !== "string")
                    .map((action, idx) => (
                      <DataHandleAction
                        key={`${model.id}-${idx}`}
                        model={model}
                        action={action}
                        sliceName={sliceName}
                      />
                    ))}
                </div>
              ),
            },
          ]
        : []),
    ];
  }, []);
  return (
    <div className={className}>
      <Table
        dataSource={(modelMap === "loading" ? [] : [...modelMap.values()]) as any[]}
        columns={cols}
        loading={modelMap === "loading"}
        size="small"
        rowKey={(model) => model.id}
        pagination={false}
        onRow={(model, idx) => ({
          onClick: () => onItemClick && onItemClick(model, idx ?? 0),
        })}
      />
      <DataPagination sliceName={sliceName} />
      <DataSearch sliceName={sliceName} />
    </div>
  );
};
