"use client";
import { Pagination } from "../daisyui/Pagination";
import { ServerInit, Utils } from "@util/client";
import { st } from "@shared/client";
import { twMerge } from "tailwind-merge";
import { useRef } from "react";

export interface LoadPaginationProps<T extends string, L> {
  className?: string;
  init: ServerInit<T, L>;
}
export default function LoadPagination<T extends string, M extends { id: string }, L>({
  className,
  init,
}: LoadPaginationProps<T, L>) {
  const loaded = useRef(
    st.get()[`${init.refName}InitAt` as any].getTime() >= init[`${init.refName}InitAt` as any].getTime()
  );
  const [refName, classRefName] = [init.refName as any, Utils.capitalize(init.refName)];
  const modelCount = st.slice[refName].use[`${refName}Count` as any]();
  const limitOfModel = st.slice[refName].use[`limitOf${classRefName}` as any]();
  const lastPageOfModel = st.slice[refName].use[`lastPageOf${classRefName}` as any]();
  const pageOfModel = st.slice[refName].use[`pageOf${classRefName}` as any]();
  const page = loaded.current ? pageOfModel : init[`pageOf${classRefName}`];
  const count = loaded.current ? modelCount : init[`${refName}Count`];
  const limit = loaded.current ? limitOfModel : init[`limitOf${classRefName}`];
  if (!loaded.current) loaded.current = true;
  return (
    <div className={twMerge("flex flex-wrap justify-center mt-4", className)}>
      <Pagination
        currentPage={page}
        total={count}
        itemsPerPage={limit || count}
        onPageSelect={(page) => st.do[`setPageOf${classRefName}`](page)}
      />
    </div>
  );
}
