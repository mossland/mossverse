"use client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Empty, Pagination } from ".";
import { PaginationProps } from "./Pagination";
import { cnst } from "@util/client";
import { st } from "@shared/client";
import { twMerge } from "tailwind-merge";
import React, { ReactNode, useMemo } from "react";
type Column = {
  key?: string;
  title: ReactNode;
  dataIndex: string;
  render?: (text: any, record: any, idx: number) => React.ReactNode;
  responsive?: cnst.Responsive[];
};

type TableProps = {
  columns: Column[];
  dataSource: any[];
  loading?: boolean;
  size?: "small" | "middle";
  bordered?: boolean;
  pagination?: PaginationProps | false;
  showHeader?: boolean;
  onRow?: (record: any, index: number) => { onClick: () => void | Promise<boolean> };
  rowClassName?: string | ((record: any, index: number) => string) | undefined;
  rowKey?: (model: any) => string;
};

export const Table = ({
  columns,
  dataSource,
  loading,
  size,
  bordered,
  pagination,
  showHeader = true,
  onRow,
  rowClassName,
  rowKey,
}: TableProps) => {
  const sizeClassName = size === "small" ? "table-compact" : "";
  const loadingClassName = loading ? "opacity-30" : "";
  const borderedClassName = bordered ? "border border-gray-200 rounded-xl" : "";
  const responsive = st.use.responsive();
  const renderedColumns = useMemo(() => {
    return columns
      .filter((c) => !c.responsive || c.responsive.includes(responsive))
      .map((column, idx) => (
        <th key={idx} className="whitespace-nowrap">
          {column.title}
        </th>
      ));
  }, [columns, responsive]);

  const renderedRows = useMemo(() => {
    return dataSource.map((rowData, rowIndex) => {
      const renderedCells = columns
        .filter((c) => !c.responsive || c.responsive.includes(responsive))
        .map((column, idx) => (
          <td
            key={idx}
            className={twMerge(
              "whitespace-nowrap",
              rowClassName ? (typeof rowClassName === "string" ? rowClassName : rowClassName(rowData, rowIndex)) : ""
            )}
            {...onRow?.(rowData, rowIndex)}
          >
            {column.render
              ? column.render(rowData[column.dataIndex], rowData, rowIndex)
              : column.dataIndex
              ? rowData[column.dataIndex]
              : null}
          </td>
        ));

      return <tr key={rowIndex}>{renderedCells}</tr>;
    });
  }, [columns, dataSource, responsive]);

  return (
    <div className={twMerge("w-full relative", loadingClassName, borderedClassName)}>
      {loading && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <AiOutlineLoading3Quarters className="text-3xl animate-spin" />
        </div>
      )}
      <table className={twMerge("table w-full", sizeClassName)}>
        {showHeader && (
          <thead className="normal-case">
            <tr>{renderedColumns}</tr>
          </thead>
        )}
        {!!dataSource.length && <tbody>{renderedRows}</tbody>}
      </table>
      {!dataSource.length && (
        <div className="w-full">
          <Empty />
        </div>
      )}
      {pagination && (
        <div className="flex justify-center mt-3">
          <Pagination
            currentPage={pagination.currentPage}
            total={pagination.total}
            onPageSelect={pagination.onPageSelect}
            itemsPerPage={pagination.itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};
