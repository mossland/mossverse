import React from "react";
import { BiCalendarEdit } from "react-icons/bi";

type SurveyRadioButtonProps = {
  label: string;
  id: string;
  handleChange: (id: string) => void;
};

export const SurveyRadioButton = ({ label, id, handleChange }: SurveyRadioButtonProps) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-slate-700 checked:border-slate-700 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        type="radio"
        name="flexRadioDefault"
        id={`radioButton-${id}`}
        onChange={() => handleChange(id)}
      />
      <label className="cursor-pointer form-check-label inline-block text-gray-800" htmlFor={`radioButton-${id}`}>
        {label}
      </label>
    </div>
  );
};
