import { Utils } from "@shared/util";
import { Slice } from "@shared/util-client";
import { twMerge } from "tailwind-merge";
import { Input, Pagination } from "@shared/ui-web";

interface DataPaginationProps<T extends string> {
  className?: string;
  slice: Slice<T, any>;
}
export const DataPagination = <T extends string, M extends { id: string }, L>({
  className,
  slice,
}: DataPaginationProps<T>) => {
  const [modelName, modelClassName] = [slice.refName, Utils.capitalize(slice.refName)];
  const modelCount = slice.use[`${modelName}Count` as any]();
  const limitOfModel = slice.use[`limitOf${modelClassName}` as any]();
  const lastPageOfModel = slice.use[`lastPageOf${modelClassName}` as any]();
  const pageOfModel = slice.use[`pageOf${modelClassName}` as any]();
  return (
    <div className={twMerge("flex flex-wrap justify-center mt-4", className)}>
      <Pagination
        currentPage={pageOfModel}
        // showQuickJumper={lastPageOfModel > 10}
        total={modelCount}
        onPageSelect={(page) => {
          slice.do[`setPageOf${modelClassName}` as any](page);
        }}
        itemsPerPage={limitOfModel || modelCount}
      />
    </div>
  );
};

interface DataSearchProps<T extends string> {
  className?: string;
  slice: Slice<T, any>;
}
export const DataSearch = <T extends string, M extends { id: string }, L>({ className, slice }: DataSearchProps<T>) => {
  const [modelName, modelClassName] = [slice.refName, Utils.capitalize(slice.refName)];
  const defaultQuery = slice.use[`defaultQueryOf${modelClassName}` as any]();
  return (
    <div className="flex flex-wrap justify-center mt-4">
      <Input.Search
        className="w-72"
        placeholder="input search text"
        onSearch={(search) =>
          slice.do[`setQueryOf${modelClassName}` as any]({
            ...defaultQuery,
            $text: search.length ? { $search: search } : undefined,
          })
        }
        enterButton
      />
    </div>
  );
};
