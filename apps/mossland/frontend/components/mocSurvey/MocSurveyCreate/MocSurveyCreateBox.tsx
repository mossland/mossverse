import React, { ReactNode } from "react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { Props } from "@shared/ui-web";

type SelectorProps = Props.BaseProps & {
  items: { id: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
};

type RangePickerProps = {
  className?: string;
  min: dayjs.Dayjs;
  max: dayjs.Dayjs;
  openAt: dayjs.Dayjs;
  closeAt: dayjs.Dayjs;
  onChange: (openAt: dayjs.Dayjs | null, closeAt: dayjs.Dayjs | null) => void;
};

type SelectionsProps = {
  selections: string[];
  updateItem: (value: string, itemIndex: number) => void;
  removeItem: (value: number) => void;
};

type SelectionProps = {
  selection: string;
  itemIndex: number;
  removeItem: (itemIndex: number) => void;
  updateItem: (value: string, itemIndex: number) => void;
};

export const MocSurveyCreateBox = ({ children, className }: Props.BaseProps) => {
  return <div className={`px-[10px] py-[20px] ${className}`}>{children}</div>;
};

const Header = ({ children, className }: Props.BaseProps) => {
  return <div className={`relative text-[24px] text-center pb-[18px] ${className}`}>{children}</div>;
};

const BackButton = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <button
      className={`absolute cursor-pointer border-0 text-[24px] left-0 top-0 bg-transparent  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Title = ({ children, className }: Props.BaseProps) => {
  return <div className={`mt-[15px] text-[26px] font-bold leading-4 ${className}`}>{children}</div>;
};

const Label = ({ children, className }: Props.BaseProps) => {
  return <div className={`text-[16px] text-[#555] mb-[8px] font-thin mt-[20px] ${className}`}>{children}</div>;
};

const Input = ({ className, onChange, placeholder, value }: Props.InputProps) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value as string)}
      className={`w-full  ${className}`}
    ></input>
  );
};

const InputArea = ({ className, onChange, placeholder, value }: Props.InputProps) => {
  return (
    <div className={`mb-[14px]`}>
      <textarea
        className="resize-none w-full h-[200px] border-[1px]  rounded-[8px] p-[14px] text-[16px] font-normal disabled:bg-gray-300 disabled:opacity-50"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange && onChange(e.target.value as string)}
      ></textarea>
    </div>
  );
};

const RangePicker = ({ className, min, max, openAt, closeAt, onChange }: RangePickerProps) => {
  return (
    <DatePicker.RangePicker
      className={`w-full ${className}`}
      value={[openAt, closeAt]}
      disabledDate={(d) => !d || d.isAfter(max) || d.isBefore(min)}
      onChange={(e) => {
        onChange(e?.[0] ? e?.[0] : null, e?.[1] ? e?.[1] : null);
      }}
    />
  );
};

const Wrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={className}>{children}</div>;
};

const Selector = ({ items, value, onChange, className }: SelectorProps) => {
  return (
    <Select className={`flex items-center ${className}`} value={value} onChange={(value) => onChange(value)}>
      {items.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
};

const Selections = ({ selections, updateItem, removeItem }: SelectionsProps) => {
  return (
    <div className="">
      {!selections.length ? (
        <Selection selection={selections?.[0] ?? ""} itemIndex={0} removeItem={removeItem} updateItem={updateItem} />
      ) : (
        selections.map((selection, index) => (
          <Selection
            key={index}
            selection={selection}
            itemIndex={index}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        ))
      )}
    </div>
  );
};

const TextArea = ({ className, onChange, placeholder, value }: Props.InputProps) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value as string)}
      className={`w-full min-h-[300px] border-[1px] border-solid border-[#d9d9d9] p-[11px] text-lg rounded-sm resize-none  ${className}`}
    ></textarea>
  );
};

const Selection = ({ itemIndex, removeItem, selection, updateItem }: SelectionProps) => {
  return (
    <div className="flex items-center mb-[10px] mt-[10px] ">
      <div className="w-full">
        <input className="w-full" value={selection} onChange={(e) => updateItem(e.target.value as string, itemIndex)} />
      </div>
      <button
        disabled={itemIndex === 0}
        className="ml-[10px] rounded-md disabled:bg-gray-400 disabled:opacity-50 px-4 py-2"
        onClick={() => removeItem(itemIndex)}
      >
        <img className="" src="/images/remove.svg" alt="remove" />
      </button>
    </div>
  );
};

const AddButton = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <button
      className={`inline-block text-[14px] cursor-pointer border-[1px] font-bold bg-white border-solid border-black rounded-[4px] p-[8px] text-[#555] bg-transparent ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const CreateButton = ({ children, className, onClick, disabled }: Props.ButtonProps) => {
  return (
    <button
      className={`cursor-pointer w-full h-[50px] text-[22px] border-[2px] mt-[20px] font-normal bg-[#FFE177] border-solid border-black rounded-[6px] p-[8px] text-black 
       disabled:opacity-50 disabled:cursor-default ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

MocSurveyCreateBox.Header = Header;
MocSurveyCreateBox.BackButton = BackButton;
MocSurveyCreateBox.CreateButton = CreateButton;
MocSurveyCreateBox.AddButton = AddButton;
MocSurveyCreateBox.Title = Title;
MocSurveyCreateBox.TextArea = TextArea;
MocSurveyCreateBox.Label = Label;
MocSurveyCreateBox.Input = Input;
MocSurveyCreateBox.InputArea = InputArea;
MocSurveyCreateBox.Wrapper = Wrapper;
MocSurveyCreateBox.Selector = Selector;
MocSurveyCreateBox.Selection = Selection;
MocSurveyCreateBox.Selections = Selections;
MocSurveyCreateBox.RangePicker = RangePicker;
