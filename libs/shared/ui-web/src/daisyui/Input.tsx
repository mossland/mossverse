import React, { InputHTMLAttributes, TextareaHTMLAttributes, KeyboardEvent, RefObject, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { BiSearch } from "react-icons/bi";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value"> & {
  status?: "error" | "warning" | "";
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  value: string | number | null;
};
export const Input = ({ className, status, onPressEnter, inputRef, value, ...rest }: InputProps) => {
  const statusClass = status === "error" ? "input-error" : status === "warning" ? "input-warning" : "";
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && event.key === "Enter") onPressEnter(event);
  };
  return (
    <input
      {...rest}
      ref={inputRef}
      value={value ?? ""}
      onKeyDown={handleKeyDown}
      className={twMerge("input input-bordered", statusClass, className)}
    />
  );
};

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onPressEnter?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};
const TextArea = ({ className, onPressEnter, ...rest }: TextAreaProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onPressEnter && event.key === "Enter") {
      onPressEnter(event);
    }
  };
  return <textarea {...rest} onKeyDown={handleKeyDown} className={twMerge("textarea textarea-bordered", className)} />;
};
Input.TextArea = TextArea;

type PasswordProps = InputHTMLAttributes<HTMLInputElement> & {
  status?: "error" | "warning" | "";
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
};
const Password = ({ className, status, onPressEnter, ...rest }: PasswordProps) => {
  const statusClass = status === "error" ? "input-error" : status === "warning" ? "input-warning" : "";
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && event.key === "Enter") {
      onPressEnter(event);
    }
  };
  return (
    <input
      {...rest}
      type="password"
      onKeyDown={handleKeyDown}
      className={twMerge("input  input-bordered", statusClass, className)}
    />
  );
};
Input.Password = Password;

type InputNumberProps = InputHTMLAttributes<HTMLInputElement> & {
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onChange: (value: number) => void;
};
export const Number = ({ className, onPressEnter, onChange, ...rest }: InputNumberProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && event.key === "Enter") {
      onPressEnter(event);
    }
  };

  const handleChange = (e) => {
    const inputVal = parseInt(e.target.value);
    if (!isNaN(inputVal)) {
      onChange(inputVal);
    }
  };

  return (
    <input
      {...rest}
      type="number"
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className={twMerge("input input-bordered", className)}
    />
  );
};
Input.Number = Number;

type SearchProps = InputHTMLAttributes<HTMLInputElement> & {
  enterButton?: boolean;
  onSearch: (value: string) => void;
  buttonClassName?: string;
};
const Search = ({ className, onSearch, buttonClassName, ...rest }: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(inputRef.current?.value || "");
    }
  };
  return (
    <div>
      <input
        {...rest}
        ref={inputRef}
        type="text"
        className={twMerge("input input-bordered rounded-r-none", className)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={() => onSearch(inputRef.current?.value || "")}
        className={twMerge("px-4 align-middle rounded-l-none btn btn-primary", buttonClassName)}
      >
        <BiSearch />
      </button>
    </div>
  );
};
Input.Search = Search;
