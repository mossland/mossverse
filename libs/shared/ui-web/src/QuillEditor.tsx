"use client";
import React, { MutableRefObject, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ImageResize from "quill-image-resize-module-react";
import { Quill } from "react-quill";
import { gql } from "@shared/data-access";
import { useInterval } from "@shared/util-client";
import { cnst } from "@shared/util";

//! TODO SunEditor가 안정적으로 적용되었다고 판단되면 삭제
export interface EditorProps {
  addFilesGql: (fileList: FileList, id?: string) => Promise<gql.File[]>;
  addFile: (file: gql.File | gql.File[], options?: { idx?: number; limit?: number }) => void;
  onChange: (content: string) => void;
  defaultValue?: string;
}
const getVideoUrl = (url: string) => {
  let match: any =
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/) ||
    url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/);
  if (match && match[2].length === 11) {
    return "https" + "://www.youtube.com/embed/" + match[2] + "?showinfo=0";
  }
  if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
    // eslint-disable-line no-cond-assign
    return (match[1] || "https") + "://player.vimeo.com/video/" + match[2] + "/";
  }
  return null;
};
export const Editor = ({ addFilesGql, addFile, onChange, defaultValue }: EditorProps) => {
  const quillRef = useRef<any>();
  const imageHandler = () => {
    if (!quillRef.current) return;
    const { getEditor } = quillRef.current;
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    // document.body.appendChild(input);
    input.click();
    const range = getEditor().getSelection(true);
    input.onchange = async (e: any) => {
      if (!e.target.files?.length) return;
      const [file] = await addFilesGql(e.target.files);
      addFile(file);
      getEditor().insertEmbed(range, "image", file.url);
      getEditor().setSelection(range.index + 1);
    };
  };
  const videoHandler = () => {
    if (!quillRef.current) return;
    const { getEditor } = quillRef.current;
    const url = prompt("Enter Video URL: ");
    const range = getEditor().getSelection(true);
    if (!url) return;
    getEditor().insertEmbed(range, "video", getVideoUrl(url));
    getEditor().setSelection(range.index + 1);
  };
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }, { align: [] }],
          ["link", "image", "video"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
      // imageResize: {
      //   parchment: Quill.import("parchment"),
      //   modules: ["Resize", "DisplaySize", "Toolbar"],
      // },
    };
  }, []);
  return (
    <CSREditor
      forwardRef={quillRef}
      modules={modules}
      defaultValue={defaultValue}
      onChange={onChange}
      theme="snow"
      formats={cnst.quillEditorFormats}
      // {...props}
    />
  );
};
const CSREditor = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill");
    // const { default: ImageResize } = await import("quill-image-resize-module");
    // Quill.register("modules/imageResize", ImageResize);
    return function comp({ forwardRef, ...props }: any) {
      return <RQ ref={forwardRef} {...props} />;
    };
  },
  { ssr: false }
);
