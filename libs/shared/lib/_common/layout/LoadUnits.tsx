"use client";
import { Empty } from "../daisyui";
import { ReactNode, useMemo, useRef } from "react";
import { ServerInit, Utils } from "@util/client";
import { Skeleton } from "../daisyui/Skeleton";
import { gqlTemp, st } from "@shared/client";
import { twMerge } from "tailwind-merge";

export interface LoadUnitsProps<T extends string, M extends { id: string }, L> {
  className?: string;
  init: ServerInit<T, L>;
  noDiv?: boolean;
  from?: number;
  to?: number;
  loading?: ReactNode;
  filter?: (item: L, idx: number) => boolean;
  renderEmpty?: () => ReactNode;
  renderItem?: (item: L, idx: number) => ReactNode;
  renderList?: (list: L[]) => ReactNode;
}
export default function LoadUnits<T extends string, M extends { id: string }, L extends { id: string }>({
  className,
  init,
  noDiv,
  from,
  to,
  loading = (
    <div className="grid w-full h-full place-items-center">
      <Skeleton active />
    </div>
  ),
  renderItem,
  renderList,
  renderEmpty = noDiv
    ? () => null
    : () => (
        <div className="grid w-full h-full place-items-center">
          <Empty className="py-16" />
        </div>
      ),
  filter = () => true,
}: LoadUnitsProps<T, M, L>) {
  const loaded = useRef(false);
  const modelMap = st.use[`${init.refName}Map` as any]();
  if (
    modelMap !== "loading" &&
    st.get()[`${init.refName}InitAt` as any].getTime() >= init[`${init.refName}InitAt` as any].getTime()
  )
    loaded.current = true;
  const modelInitMap = useMemo(() => {
    const map = new Map();
    if (loaded.current) return map;
    init[`${init.refName}ObjList` as any].forEach((model) =>
      map.set(model.id, gqlTemp[`lightCrystalize${Utils.capitalize(init.refName)}`](model))
    );
    st.set({ ...(init as any), [`${init.refName}Map`]: map, [`${init.refName}InitMap`]: map });
    return map;
  }, []);
  const modelList = !loaded.current
    ? [...modelInitMap.values()].filter(filter)
    : modelMap === "loading"
    ? "loading"
    : [...modelMap.values()].filter(filter);
  if (modelList === "loading") return <>{loading}</>;
  if (renderList) return <>{modelList.length ? renderList(modelList) : renderEmpty()}</>;
  else if (!renderItem) throw new Error("renderItem is required");
  else
    return (
      <>
        {noDiv ? (
          modelList.length ? (
            modelList.slice(from ?? 0, to ?? modelList.length + 1).map((model, idx) => renderItem(model, idx))
          ) : renderEmpty ? (
            renderEmpty()
          ) : null
        ) : (
          <div className={twMerge(className, !modelList.length ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-1" : "")}>
            {modelList.length
              ? modelList
                  .slice(from ?? 0, to ?? modelList.length + 1)
                  .map((model, idx) => <div key={model.id}>{renderItem(model, idx)}</div>)
              : renderEmpty
              ? renderEmpty()
              : null}
          </div>
        )}
      </>
    );
}
