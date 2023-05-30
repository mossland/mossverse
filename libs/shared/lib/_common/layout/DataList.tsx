"use client";
import { Input, Pagination, st } from "@shared/client";
import { Utils } from "@util/client";
import { twMerge } from "tailwind-merge";

export interface DataPaginationProps<T extends string> {
  className?: string;
  sliceName: string;
}
export const DataPagination = <T extends string, M extends { id: string }, L>({
  className,
  sliceName,
}: DataPaginationProps<T>) => {
  const [modelName, modelClassName] = [sliceName, Utils.capitalize(sliceName)];
  const modelCount = st.slice[sliceName].use[`${modelName}Count` as any]();
  const limitOfModel = st.slice[sliceName].use[`limitOf${modelClassName}` as any]();
  const lastPageOfModel = st.slice[sliceName].use[`lastPageOf${modelClassName}` as any]();
  const pageOfModel = st.slice[sliceName].use[`pageOf${modelClassName}` as any]();
  return (
    <div className={twMerge("flex flex-wrap justify-center mt-4", className)}>
      <Pagination
        currentPage={pageOfModel}
        // showQuickJumper={lastPageOfModel > 10}
        total={modelCount}
        onPageSelect={(page) => {
          st.slice[sliceName].do[`setPageOf${modelClassName}` as any](page);
        }}
        itemsPerPage={limitOfModel || modelCount}
      />
    </div>
  );
};

export interface DataSearchProps<T extends string> {
  className?: string;
  sliceName: string;
}
export const DataSearch = <T extends string, M extends { id: string }, L>({
  className,
  sliceName,
}: DataSearchProps<T>) => {
  const [modelName, modelClassName] = [st.slice[sliceName].refName, Utils.capitalize(st.slice[sliceName].refName)];
  const defaultQuery = st.slice[sliceName].use[`defaultQueryOf${modelClassName}` as any]();
  return (
    <div className="flex flex-wrap justify-center mt-4">
      <Input.Search
        className="w-72"
        placeholder="input search text"
        onSearch={(search) =>
          st.slice[sliceName].do[`setQueryOf${modelClassName}` as any]({
            ...defaultQuery,
            $text: search.length ? { $search: search } : undefined,
          })
        }
        enterButton={true}
      />
    </div>
  );
};
