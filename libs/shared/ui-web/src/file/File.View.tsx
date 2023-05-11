import { gql, st, slice, useLocale } from "@shared/data-access";
import { RecentTime } from "@shared/ui-web";
import Router from "next/router";

interface FileViewProps {
  file: gql.File;
  slice?: slice.FileSlice;
}
export const FileView = ({ file, slice = st.slice.file }: FileViewProps) => {
  const { l } = useLocale();
  return (
    <div>
      <div className="flex justify-between p-2 mt-4 mb-0 text-2xl border-b border-gray-200">
        <h3>
          {l("file.id")}-{file.id}
        </h3>
      </div>
      <div className="flex justify-between p-4 mt-0 text-xs bg-gray-50 md:text-base">
        <div>{file.id}</div>
        <RecentTime date={file.createdAt} breakUnit="second" timeOption={{ dateStyle: "short", timeStyle: "short" }} />
      </div>
    </div>
  );
};
