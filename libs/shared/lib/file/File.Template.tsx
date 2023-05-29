"use client";
import { st, usePage } from "@shared/client";

interface FileEditProps {
  fileId?: string | null;
}
export const General = ({ fileId = undefined }: FileEditProps) => {
  const fileForm = st.use.fileForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <p className="w-20 mt-3">{l("file.url")}</p>
      <input
        className="input input-bordered"
        value={fileForm.url}
        onChange={(e) => st.do.setUrlOnFile(e.target.value)}
      />
    </div>
  );
};
