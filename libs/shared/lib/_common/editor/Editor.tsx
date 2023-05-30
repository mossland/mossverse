"use client";
import "suneditor/dist/css/suneditor.min.css";
import { fetch } from "@shared/client";
import { useRef } from "react";
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

export interface EditorProps {
  addFilesGql: (fileList: FileList, id?: string) => Promise<fetch.File[]>;
  addFile: (file: fetch.File | fetch.File[], options?: { idx?: number; limit?: number }) => void;
  onChange: (content: string) => void;
  defaultValue?: string;
  height?: string;
  defaultStyle?: string;
}

export default function Editor({
  addFilesGql,
  addFile,
  onChange,
  defaultValue,
  height = "500px",
  defaultStyle = "",
}: EditorProps) {
  const editor = useRef();

  const options = {
    defaultStyle: defaultStyle,
    buttonList: [
      // ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      // ["paragraphStyle", "blockquote"],
      ["bold", "underline", "italic", "strike" /** 'subscript', 'superscript' */],
      ["fontColor", "hiliteColor" /** , 'textStyle' */],
      ["codeView"],
      // ["outdent", "indent"],
      ["align", "list", "lineHeight"], // "horizontalRule",
      // '/', // Line break
      ["table", "link", "image", "video" /**'video', 'audio' ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
      /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
      // ["fullScreen", "showBlocks", "codeView"],
      // ["removeFormat"],
      // ['preview', 'print'],
      // ['save', 'template'],
    ],
    // plugins: [plugin],
  };

  const getSunEditorInstance = (sunEditor: any) => {
    editor.current = sunEditor;
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    (async () => {
      const [file] = await addFilesGql(files);
      const intervalKey = setInterval(async () => {
        const currentFile = await fetch.getFile(file.id);
        if (currentFile.status !== "uploading") {
          clearInterval(intervalKey);
          addFile(currentFile);
          const response = {
            result: [{ url: `${currentFile.url}`, name: currentFile.filename, size: currentFile.size }],
          };
          uploadHandler(response);
        }
      }, 1000);
    })();
    uploadHandler();
  };

  return (
    <SunEditor
      lang="ko"
      // key={Date.now()} // defaultValue가 변경되었을 때, 에디터가 새로 렌더링 되도록 하기 위함
      getSunEditorInstance={getSunEditorInstance}
      defaultValue={defaultValue}
      placeholder="Please type here..."
      width="100%"
      height={height}
      setOptions={options}
      setAllPlugins={true}
      onChange={onChange}
      onImageUploadBefore={handleImageUploadBefore}
    />
  );
}
