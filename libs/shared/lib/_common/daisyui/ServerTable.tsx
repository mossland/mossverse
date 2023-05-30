import { Empty } from ".";
import { Link, OnlyShow } from "../headless";
import { cnst } from "@util/client";
import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";
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
  showHeader?: boolean | cnst.Responsive[];
  href?: (record: any, index: number) => string;
  rowClassName?: string | ((record: any, index: number) => string) | undefined;
  rowKey?: (model: any) => string;
};

export const ServerTable = ({
  columns,
  dataSource,
  loading,
  size,
  bordered,
  showHeader = true,
  href,
  rowClassName,
}: TableProps) => {
  const sizeClassName = size === "small" ? "table-compact" : "";
  const loadingClassName = loading ? "opacity-30" : "";
  const borderedClassName = bordered ? "border border-gray-200 rounded-xl" : "";
  const renderedColumns = columns.map(({ title, responsive }, idx) => (
    <th
      key={idx}
      className={twMerge(
        "whitespace-nowrap",
        !responsive
          ? ""
          : cnst.responsives.map((r) => r + (responsive.includes(r) ? ":visible" : ":invisible")).join(" ")
      )}
    >
      {title}
    </th>
  ));

  const renderedRows = dataSource.map((rowData, rowIndex) => {
    const renderedCells = columns.map((column, idx) => (
      <td
        key={idx}
        className={twMerge(
          "whitespace-nowrap",
          !column.responsive
            ? ""
            : cnst.responsives.map((r) => r + (column.responsive?.includes(r) ? ":visible" : ":invisible")).join(" "),
          rowClassName ? (typeof rowClassName === "string" ? rowClassName : rowClassName(rowData, rowIndex)) : ""
        )}
      >
        <Link href={href?.(rowData, rowIndex)}>
          {column.render
            ? column.render(rowData[column.dataIndex], rowData, rowIndex)
            : column.dataIndex
            ? rowData[column.dataIndex]
            : null}
        </Link>
      </td>
    ));

    return (
      <tr key={rowIndex} className="hover">
        {renderedCells}
      </tr>
    );
  });

  return (
    <div className={twMerge("w-full overflow-auto relative", loadingClassName, borderedClassName)}>
      <table className={twMerge("table w-full", sizeClassName)}>
        <OnlyShow show={showHeader}>
          <thead className="normal-case ">
            <tr>{renderedColumns}</tr>
          </thead>
        </OnlyShow>
        {!!dataSource.length && <tbody>{renderedRows}</tbody>}
      </table>
      {!dataSource.length && (
        <div className="w-full">
          <Empty />
        </div>
      )}
    </div>
  );
};
