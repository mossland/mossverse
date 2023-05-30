"use client";
import { Slice } from "@util/client";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export interface DataDashboardProps<T extends string, State, SL extends Slice<T, State>> {
  className?: string;
  summary: { [key: string]: number };
  sliceName: string;
  queryMap: { [key: string]: any };
  columns?: string[];
  presents?: string[];
  hidePresents?: boolean;
}

export const DataDashboard = <T extends string, State, SL extends Slice<T, State>>({
  className,
  summary,
  sliceName,
  queryMap,
  columns,
  presents,
  hidePresents,
}: DataDashboardProps<T, State, SL>) => {
  const filter = useSearchParams()?.get("filter") as string;
  return (
    <div className={twMerge("stats shadow w-full flex justify-center flex-wrap my-2 py-0 ", className)}>
      <div className=" stats">
        {columns?.map(
          (column) =>
            summary[column] !== undefined &&
            queryMap[column] !== undefined && (
              <button
                key={column}
                className={`btn btn-ghost w-48 h-32 pt-3 rounded-none mx-1  hover:border ${
                  filter === column ? "border" : "border-0"
                }`}
              >
                <Link key={column} className="stat" href={`/admin?topMenu=Data&subMenu=${sliceName}&filter=${column}`}>
                  <div className="stat-title">{column}</div>
                  <div className="stat-value text-primary">{summary[column].toLocaleString()}</div>
                </Link>
              </button>
            )
        )}
        {!hidePresents
          ? presents?.map(
              (present) =>
                summary[present] !== undefined &&
                queryMap[present] !== undefined && (
                  <button key={present} className={`btn btn-ghost w-48 h-32 pt-3 rounded-none mx-1 border-none`}>
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
