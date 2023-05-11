import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataEditModal, DataListContainer, DataTableList } from "@shared/ui-web";
import { DefaultOf, ModelsProps, pageMap, PageMap } from "@shared/util-client";
import * as File from ".";
import { useTranslation } from "react-i18next";
import Router from "next/router";
import { useCallback, useState } from "react";
import { SkeletonList } from "../Loading";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";

export const FileList = ({ slice = st.slice.file, init }: ModelsProps<slice.FileSlice, gql.File>) => {
  return (
    <DataListContainer
      init={init}
      slice={slice}
      renderItem={File.Item}
      renderDashboard={File.Stat}
      queryMap={gql.fileQueryMap}
      type="list"
      columns={["filename", "createdAt", "status"]}
      actions={(file: gql.LightFile, idx) => ["remove", "view"]}
    />
  );
};

interface FileListImageGalleryProps {
  slice?: slice.FileSlice;
  fileList?: gql.File[] | "loading";
}
export const FileListImageGallery = ({
  slice = st.slice.file,
  fileList = slice.use.fileList(),
}: FileListImageGalleryProps) => {
  const fileModal = slice.use.fileModal();
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <>
      <div className="gap-2 flex flex-wrap">
        {fileList === "loading" ? (
          <SkeletonList className="flex" num={8} width={180} height={120} />
        ) : (
          fileList.map((file, idx) => (
            <Image
              key={idx}
              className="w-44 h-32 object-cover cursor-pointer"
              onClick={() => {
                setImgIdx(idx);
                slice.do.setFileModal("imageGallery");
              }}
              src={file.url}
              width={176}
              height={128}
              alt="item image"
              placeholder="blur"
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
            />
          ))
        )}
      </div>
      {fileList !== "loading" && fileModal === "imageGallery" && (
        <ImageViewer
          src={fileList.map((file) => file.url)}
          currentIndex={imgIdx}
          onClose={() => slice.do.setFileModal(null)}
          disableScroll={false}
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1000 }}
          closeOnClickOutside={true}
        />
      )}
    </>
  );
};
FileList.ImageGallery = FileListImageGallery;
