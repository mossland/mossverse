"use client";
import { defaultMarks, makeDefaultPlugins } from "./Yopta";
import { fetch } from "@shared/client";
import { useMemo } from "react";
import ActionMenu from "@yoopta/action-menu-list";
import Toolbar from "@yoopta/toolbar";
import YooptaEditor from "@yoopta/editor";

export interface EditorProps {
  className?: string;
  addFilesGql?: (fileList: FileList, id?: string) => Promise<fetch.LightFile[]>;
  addFile?: (file: fetch.LightFile | fetch.LightFile[], options?: { idx?: number; limit?: number }) => void;
  onChange?: (content: any) => void;
  defaultValue?: any;
  id?: string;
  readOnly?: boolean;
}

export default function BlockEditor({
  id,
  className,
  addFilesGql = fetch.addFile,
  addFile,
  onChange = (content) => ({}),
  defaultValue,
  readOnly,
}: EditorProps) {
  const key = useMemo(() => id ?? Math.random().toString(36).slice(2, 9), [id]);
  const marks = useMemo(() => defaultMarks, []);
  const plugins = useMemo(() => makeDefaultPlugins({ addFilesGql, addFile }), [addFile, addFilesGql]);
  return (
    <YooptaEditor
      key={key}
      className={className}
      value={defaultValue}
      onChange={onChange}
      plugins={plugins}
      marks={marks}
      placeholder="Start typing..."
      autoFocus
      readOnly={readOnly}
      tools={{
        Toolbar: <Toolbar type="bubble" />,
        ActionMenu: <ActionMenu />,
      }}
    />
  );
}
