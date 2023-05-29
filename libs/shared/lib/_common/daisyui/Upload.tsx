"use client";
import { AiOutlineDelete } from "react-icons/ai";
import { ChangeEvent, useRef } from "react";
import { Image, fetch } from "@shared/client";
import { Utils } from "@util/client";
import { twMerge } from "tailwind-merge";

type UploadProps = {
  multiple?: boolean;
  listType?: "picture-card" | "text";
  fileList?: fetch.File[];
  // onUpload: (files: FileList | File[]) => void;
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: any) => void;
  onRemove?: (e: any) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  maxCount?: number;
  className?: string;
};

export const Upload = ({
  multiple = false,
  fileList = [],
  onChange,
  onRemove,
  listType = "picture-card",
  children,
  disabled = false,
  maxCount,
  className = "",
}: UploadProps) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange && files && onChange(files[0]);
  };

  const handFileRemove = (fileIdx: number) => {
    onRemove && fileList && onRemove(fileList[fileIdx]);
  };
  return (
    <div className={twMerge("flex gap-2 flex-wrap", className)}>
      {fileList?.map((file, idx) => {
        return (
          <div
            key={file.id}
            className="p-2 w-[100px] h-[100px] bg-white border rounded-lg flex justify-center items-center text-center text-sm cursor-pointer hover:border-primary transfrom duration-300"
          >
            {file.status === "uploading" ? (
              <div>
                <progress
                  className="w-10 transition duration-700 progress progress-primary"
                  value={file?.progress || 0}
                  max="100"
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                {listType === "picture-card" && file.url && Utils.isImageFile(file.filename) ? (
                  <Image
                    src={file.url}
                    className="object-contain"
                    onError={() => <div>{file?.filename ?? file.id}</div>}
                  />
                ) : (
                  <div className="absolute w-full h-full truncate aboslute">{file?.filename ?? file.id}</div>
                )}
                <div className="absolute flex items-center justify-center w-full h-full hover:bg-black/40 group">
                  <AiOutlineDelete
                    onClick={() => handFileRemove(idx)}
                    className="text-lg transition duration-300 text-white/0 group-hover:text-white/100"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {(!maxCount || !fileList?.length || (maxCount && fileList && fileList.length < maxCount)) && (
        <div
          className="w-[100px] h-[100px] bg-gray-50 border border-dashed rounded-lg flex justify-center items-center text-center text-sm cursor-pointer hover:border-primary transfrom duration-300"
          onClick={() => inputFileRef.current?.click()}
        >
          <input ref={inputFileRef} type="file" multiple={multiple} className="hidden" onChange={handleFileSelect} />
          {children}
        </div>
      )}
    </div>
  );
};
