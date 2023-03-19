import { MonitorOutlined, ShopOutlined } from "@ant-design/icons";
import { Utils } from "@shared/util";
import { Slice } from "@shared/util-client";
import Router from "next/router";
import { twMerge } from "tailwind-merge";

interface DataDashboardProps<T extends string, State, SL extends Slice<T, State>> {
  className?: string;
  summary: { [key: string]: number };
  slice: SL;
  queryMap: { [key: string]: any };
  columns?: string[];
  presents?: string[];
  hidePresents?: boolean;
}

export const DataDashboard = <T extends string, State, SL extends Slice<T, State>>({
  className,
  summary,
  slice,
  queryMap,
  columns,
  presents,
  hidePresents,
}: DataDashboardProps<T, State, SL>) => {
  const filter = Router.query.filter as string;
  return (
    <div className={twMerge("w-full flex justify-center flex-wrap my-2 py-0 border border-gray-300", className)}>
      <div className="shadow stats">
        {columns?.map(
          (column) =>
            summary[column] !== undefined &&
            queryMap[column] !== undefined && (
              <button
                key={column}
                className={`btn btn-ghost w-72 h-32 pt-3 rounded-none mx-1  hover:border ${
                  filter === column ? "border" : "border-0"
                }`}
                onClick={() =>
                  Router.push({
                    pathname: "/admin",
                    query: { topMenu: "Data", subMenu: slice.refName, filter: column },
                  })
                }
              >
                <div className="stat">
                  <div className="stat-title">{column}</div>
                  <div className="stat-value text-primary">{summary[column]}</div>
                </div>
              </button>
            )
        )}
        {!hidePresents
          ? presents?.map(
              (present) =>
                summary[present] !== undefined &&
                queryMap[present] !== undefined && (
                  <button key={present} className={`btn btn-ghost w-72 h-32 pt-3 rounded-none mx-1 border-none`}>
                    <div className="stat">
                      <div className="stat-title">{present}</div>
                      <div className="stat-value text-primary">{summary[present]}</div>
                    </div>
                  </button>
                )
            )
          : null}
      </div>
    </div>
  );
};
