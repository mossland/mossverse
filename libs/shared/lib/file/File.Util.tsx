"use client";
import * as File from "./_client";
import { AiOutlineFile } from "react-icons/ai";
import { DataDashboard, Image, fetch, st } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { useState } from "react";
import ImageViewer from "react-simple-image-viewer";

export const Menu: DataMenuItem = {
  key: "file",
  label: "File",
  icon: <AiOutlineFile />,
  render: () => <File.Zone.Admin />,
};

export const Stat = ({
  summary,
  sliceName = "file",
  queryMap = fetch.fileQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.FileSummary>) => {
  return (
    <DataDashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalFile"]}
      hidePresents={hidePresents}
    />
  );
};
interface FileZoneImageGalleryProps {
  srcs: string[];
}
export const ImageGallery = ({ srcs }: FileZoneImageGalleryProps) => {
  const fileModal = st.use.fileModal();
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <>
      <div className="gap-2 flex flex-wrap">
        {srcs.map((src, idx) => (
          <Image
            key={idx}
            className="w-44 h-32 object-cover cursor-pointer"
            onClick={() => {
              setImgIdx(idx);
              st.do.setFileModal("imageGallery");
            }}
            src={src}
            width={176}
            height={128}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        ))}
      </div>
      {fileModal === "imageGallery" && (
        <ImageViewer
          src={srcs}
          currentIndex={imgIdx}
          onClose={() => st.do.setFileModal(null)}
          disableScroll={false}
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1000 }}
          closeOnClickOutside={true}
        />
      )}
    </>
  );
};
