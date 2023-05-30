"use client";
import { AiFillEdit, AiOutlineEnter } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export const Typography = ({ children }: { children: ReactNode }) => {
  return <p>{children}</p>;
};

type TypographyTitleProps = {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  children?: ReactNode;
};

const TypographyTitle = ({ className = "", level = 1, children }: TypographyTitleProps) => {
  const levelClassName = level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : level === 3 ? "text-xl" : "text-lg";

  return <p className={twMerge("prose", levelClassName, className)}>{children}</p>;
};

Typography.Title = TypographyTitle;

type EditableProps = {
  onChange?: (value: string) => void;
  onEnd?: () => void;
  onCancel?: () => void;
  onStart?: () => void;
};

type TypographyTextProps = {
  className?: string;
  children?: ReactNode;
  editable?: EditableProps | boolean;
  onBlur?: (value?: string) => void;
};

const TypographyText = ({ className, children, editable, onBlur }: TypographyTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isEditing && typeof editable === "object" && editable?.onStart) editable.onStart();
  }, [isEditing, editable]);

  const handleBlur = () => {
    if (contentRef.current && typeof editable === "object") {
      const newContent = contentRef.current.textContent;
      newContent && editable.onChange && editable.onChange(newContent);
      editable.onCancel && editable.onCancel();
      onBlur && onBlur(newContent || undefined);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleBlur();
  };

  if (editable) {
    return (
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <p
              ref={contentRef}
              className="p-1 border border-blue-400 rounded"
              contentEditable
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            >
              {children}
            </p>
            <div className="text-blue-400 cursor-pointer" onClick={() => setIsEditing(false)}>
              <AiOutlineEnter />
            </div>
          </>
        ) : (
          <>
            <p ref={contentRef} className={twMerge("prose", className)}>
              {children}
            </p>
            <div className="text-blue-400 cursor-pointer" onClick={() => setIsEditing(true)}>
              <AiFillEdit />
            </div>
          </>
        )}
      </div>
    );
  }
  return <p className={twMerge("prose", className)}>{children}</p>;
};

Typography.Text = TypographyText;
