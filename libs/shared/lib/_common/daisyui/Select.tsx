"use client";
import { AiFillCloseCircle, AiOutlineCheck, AiOutlineClose, AiOutlineDown, AiOutlineLoading } from "react-icons/ai";
import { animated, useSpring } from "@react-spring/web";
import { twMerge } from "tailwind-merge";
import React, { useEffect, useRef, useState } from "react";

type SelectContextType = {
  handleOptionClick: (value: any) => void;
  isOpen: boolean;
  selectedValues: string[];
  isMultiple: boolean;
};

const SelectContext = React.createContext<SelectContextType>({
  handleOptionClick: (value: any) => {
    //
  },
  isOpen: false,
  selectedValues: [""],
  isMultiple: false,
});

type SelectProps<T> = {
  children: React.ReactNode;
  value?: T;
  onChange?: (value: T) => void;
  mode?: "multiple" | "single";
  style?: React.CSSProperties;
  allowClear?: boolean;
  className?: string;
  innerClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
  onClear?: () => void;
  defaultValue?: T;
};

export const Select = ({
  children,
  value,
  onChange,
  mode,
  allowClear,
  className = "",
  innerClassName = "",
  disabled,
  placeholder,
  loading,
  onClear,
  defaultValue,
  style = {},
}: SelectProps<typeof value>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? [...value] : [value]);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setSelectedValues(Array.isArray(value) ? [...value] : [value]);
  }, [value]);

  //* defulatValue가 있을 경우 초기화
  useEffect(() => {
    if (defaultValue) setSelectedValues(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  }, [defaultValue]);

  //* 옵션 열림/닫힘 애니메이션
  const optionsProps = useSpring({
    opacity: isOpen ? 1 : 0,
    scaleY: isOpen ? 1 : 0,
    from: { opacity: 0, scaleY: 0 },
    config: { mass: 1, tension: 500, friction: 50, duration: 140 },
  });

  //* 배경 클릭시 옵션 닫힘
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //* 옵션 클릭
  const handleOptionClick = (checkedValue: typeof value) => {
    if (mode === "multiple") {
      let newSelectedValues: string[] = [];
      if (selectedValues.includes(checkedValue)) {
        newSelectedValues = selectedValues.filter((cur) => cur !== checkedValue);
      } else {
        newSelectedValues = [...selectedValues, checkedValue];
      }
      onChange?.(newSelectedValues);
      setSelectedValues(newSelectedValues);
    } else {
      onChange?.(checkedValue);
      setSelectedValues([checkedValue]);
      setIsOpen(false);
    }
  };

  //* value 값으로 label 찾기
  const findLabelByValue = (children, value) => {
    let result;
    React.Children.forEach(children, (child) => {
      if (child.props?.value === value) result = child.props.children;
    });
    return result;
  };

  const disabledClassName = disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "";
  const isOpenClassName = isOpen ? "ring-2 ring-primary/20 border-primary" : "";
  return (
    <SelectContext.Provider value={{ handleOptionClick, isOpen, selectedValues, isMultiple: mode === "multiple" }}>
      <div className={twMerge("relative inline-block min-w-[100px]", className)} ref={selectRef} style={style}>
        <div
          className={twMerge(
            `w-full flex justify-between items-center gap-2 px-2 py-1 mb-1 border rounded-md cursor-pointer duration-400 transition-all`,
            isOpenClassName,
            disabledClassName,
            innerClassName
          )}
          onClick={() => disabled || setIsOpen(!isOpen)}
        >
          {!selectedValues.length ||
            (selectedValues?.[0] === "" && placeholder && (
              <div className="text-gray-300 whitespace-nowrap">{placeholder}</div>
            ))}

          {mode === "multiple" ? (
            <>
              <div className={`min-w-[10px] min-h-[18px] duration-400 transition-all ${isOpen && "opacity-40"}`}>
                <div className="flex flex-wrap gap-1">
                  {selectedValues
                    .filter((value) => value !== "")
                    .map((value, idx) => (
                      <div key={idx} className="inline-block px-1 bg-gray-100 border rounded-md">
                        <div className="flex items-center gap-1">
                          {findLabelByValue(children, value)}
                          <AiOutlineClose
                            className="text-sm text-gray-400 transition-all hover:text-gray-600 duration-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedValues(selectedValues.filter((cur) => cur !== value));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {allowClear && !!selectedValues.length && (
                <AiFillCloseCircle
                  className="text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValues([]);
                    onChange?.([]);
                    onClear?.();
                  }}
                />
              )}
            </>
          ) : (
            <div
              className={`w-full flex items-center justify-between min-w-[10px] min-h-[18px] duration-400 transition-all overflow-hidden ${
                isOpen && "opacity-40"
              }`}
            >
              <div>{findLabelByValue(children, selectedValues?.[0])}</div>
              {loading ? (
                <AiOutlineLoading className="animate-spin opacity-40" />
              ) : allowClear && selectedValues?.[0] !== "" ? (
                <AiFillCloseCircle
                  className="text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValues([""]);
                    onChange?.("");
                    onClear?.();
                  }}
                />
              ) : (
                <AiOutlineDown className="opacity-40" />
              )}
            </div>
          )}
        </div>
        {/* isOpen이 true일 때만 옵션 렌더링 */}
        <animated.div
          className="scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-primary/10 absolute z-50 w-full max-h-[240px] overflow-y-auto p-1 origin-top bg-white rounded-md drop-shadow-lg"
          style={{ transformOrigin: "top", ...optionsProps }}
        >
          {children}
        </animated.div>
      </div>
    </SelectContext.Provider>
  );
};

type OptionProps = {
  value: string | number;
  children: React.ReactNode;
};

const Option = ({ value, children }: OptionProps) => {
  const { handleOptionClick, selectedValues, isMultiple } = React.useContext(SelectContext);

  return (
    <div
      className={`flex justify-between cursor-pointer px-2 py-1 rounded-md truncate hover:bg-gray-100 duration-400 transition-all ${
        selectedValues.some((cur) => cur === value) ? "bg-primary/20 hover:bg-primary/20 font-bold" : ""
      }`}
      onClick={() => handleOptionClick(value)}
    >
      <div>{children}</div>
      {isMultiple && selectedValues.some((cur) => cur === value) && <AiOutlineCheck className="text-primary" />}
    </div>
  );
};

Select.Option = Option;
