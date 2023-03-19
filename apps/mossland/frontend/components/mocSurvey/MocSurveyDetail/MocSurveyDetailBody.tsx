import React, { ReactNode } from "react";
import Link from "next/link";
import { Radio } from "antd";
import { Props } from "@shared/ui-web";
import { twMerge } from "tailwind-merge";

export const MocSurveyDetailBody = ({ children, className }: Props.BaseProps) => {
  return <div className={twMerge("bg-[#e8e8e8] p-[23px]", className)}>{children}</div>;
};

const Wrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={twMerge("", className)}>{children}</div>;
};

const ButtonWrapper = ({ children, className }: Props.BaseProps) => {
  return <div className={twMerge("flex justify-between", className)}>{children}</div>;
};

const SurveyButton = ({ children, disabled, className, onClick }: Props.ButtonProps) => {
  return (
    <button
      className={twMerge(
        "min-h-[50px] mx-[4px] w-full text-[22px] border-solid border-[2px] border-black rounded-[10px] font-normal brightness-[1] bg-white disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-opacity-80",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

type ObjectiveFormProps = {
  selections: string[];
  selection: number | null;
  disabled?: boolean;
  onSelect: (value: number) => void | undefined;
};

const ObjectiveForm = ({ selections, selection, disabled, onSelect }: ObjectiveFormProps) => {
  return (
    <div className="mb-[16px] block">
      <Radio.Group
        value={selection}
        onChange={(e) => onSelect(e.target.value as number)}
        size="large"
        buttonStyle="solid"
        className=""
        disabled={disabled}
      >
        {selections.map((sel, index) => {
          return (
            <Radio
              key={index}
              value={index}
              disabled={disabled}
              className="text-[18px] leading-4 block mb-[17px] font-normal"
              onClick={() => onSelect(index)}
              checked={selection === index}
            >
              {sel}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
};

type SubjectiveFormProps = {
  disabled: boolean;
  answer: string | null;
  onChange: (value: string) => void | undefined;
};
const SubjectiveForm = ({ answer, disabled, onChange }: SubjectiveFormProps) => {
  return (
    <div className={`mb-[16px]`}>
      <textarea
        className="outline-none resize-none w-full h-[369px] border-[0px] border-black rounded-[6px] p-[14px] text-[16px] font-normal disabled:bg-white disabled:opacity-50"
        value={answer ?? ""}
        disabled={disabled}
        placeholder={disabled ? "" : "답변을 달아주세요."}
        onChange={(e) => onChange(e.target.value as string)}
      ></textarea>
    </div>
  );
};

MocSurveyDetailBody.Wrapper = Wrapper;
MocSurveyDetailBody.SurveyButton = SurveyButton;
MocSurveyDetailBody.ObjectiveForm = ObjectiveForm;
MocSurveyDetailBody.SubjectiveForm = SubjectiveForm;
MocSurveyDetailBody.ButtonWrapper = ButtonWrapper;
