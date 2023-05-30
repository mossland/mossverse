"use client";
import { AiOutlineComment } from "react-icons/ai";
import { Editor } from "slate";
import { defaultMarks, makeDefaultPlugins } from "./Yopta";
import { useEffect, useMemo, useState } from "react";
import { useSlate } from "slate-react";
import Toolbar, { ToolbarProps } from "@yoopta/toolbar";
import YooptaEditor, { createYooptaMark, generateId, useMarks } from "@yoopta/editor";

export interface EditorProps {
  className?: string;
  onChange?: (content: any) => void;
  onComment?: (group: string) => Promise<void>;
  onClickComment?: (group: string) => void;
  defaultValue?: any;
  reset?: boolean;
  id?: string;
}

export const commentMark = createYooptaMark({ type: "comment", hotkey: "mod+h", className: "bg-primary/20" });

export default function BlockCommentor({
  id,
  className,
  reset,
  onComment,
  onClickComment,
  onChange = (content) => ({}),
  defaultValue,
}: EditorProps) {
  const [group, setGroup] = useState<string | null>(null);
  const [commentGroup, setCommentGroup] = useState<string | null>(null);
  const key = useMemo(() => id ?? Math.random().toString(36).slice(2, 9), [id]);
  const marks = useMemo(() => [...defaultMarks, commentMark], []);
  const plugins = useMemo(() => makeDefaultPlugins({}), []);

  const CommentToolbar = (props: ToolbarProps) => {
    const { getRootProps } = props;
    const marks = useMarks();
    const editor = useSlate();
    const containComment =
      editor.selection && (Editor.node(editor, editor.selection)[0] as any).children?.some((node) => node.comment);
    useEffect(() => {
      const commentGroup =
        editor.selection?.anchor.offset === editor.selection?.focus.offset
          ? (Editor.marks(editor) as any)?.comment
          : null;
      setCommentGroup(commentGroup);
    });
    useEffect(() => {
      if (commentGroup) onClickComment?.(commentGroup);
      setGroup(null);
    }, [commentGroup]);
    useEffect(() => {
      if (!reset || !group) return;
      Editor.removeMark(editor, "comment");
    }, [reset]);
    useEffect(() => {
      onChange(editor.children);
    }, [editor.children]);
    return (
      <div {...getRootProps()}>
        <div className=" inline-flex items-stretch h-8 bg-white overflow-hidden text-sm leading-5 rounded shadow pointer-events-auto">
          <div className=" select-none transition-all cursor-pointer flex items-center p-0 whitespace-nowrap shadow mr-[1px]">
            {!containComment && (
              <button
                type="button"
                onClick={async () => {
                  const group = generateId();
                  await onComment?.(group);
                  Editor.addMark(editor, "comment", group);
                  setGroup(group);
                }}
                className="select-none transition-all cursor-pointer flex gap-1 items-center px-2 py-4 h-full border-0 hover:opacity-50 bg-primary text-white"
              >
                <AiOutlineComment className="mt-0.5" />
                <span>댓글달기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <YooptaEditor
      key={key}
      className={className}
      value={defaultValue}
      onChange={() => {
        // Do nothing
      }}
      plugins={plugins}
      marks={marks}
      autoFocus
      readOnly
      tools={{ Toolbar: <Toolbar render={CommentToolbar} /> }}
    />
  );
}
