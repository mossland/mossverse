"use client";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineSwapRight } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
const ReactDatePicker = dynamic(() => import("react-datepicker"), { ssr: false });

type DatePickerProps = {
  value?: dayjs.Dayjs | null;
  onChange: (value: dayjs.Dayjs) => void;
  showTime?: boolean;
  format?: string;
  timeIntervals?: number;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  className?: string;
  defaultValue?: dayjs.Dayjs;
};

export const DatePicker = ({
  value,
  onChange,
  showTime,
  format = "yyyy-MM-dd",
  timeIntervals = 10,
  disabledDate,
  className = "",
  defaultValue,
}: DatePickerProps) => {
  useEffect(() => {
    if (defaultValue) {
      onChange(defaultValue);
    }
  }, [defaultValue]);

  return (
    <ReactDatePicker
      className={twMerge("input input-bordered", className)}
      selected={value ? value.toDate() : new Date()}
      onChange={(date: Date) => onChange(dayjs(date))}
      showTimeSelect={showTime}
      timeIntervals={timeIntervals}
      filterDate={(date) => (disabledDate ? disabledDate(dayjs(date)) : true)}
      dateFormat={format}
    />
  );
};

type RangePickerProps = {
  value: [dayjs.Dayjs, dayjs.Dayjs] | [null, null];
  onChange: (value: [dayjs.Dayjs, dayjs.Dayjs]) => void;
  format?: string;
  showTime?: boolean;
  timeIntervals?: number;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  className?: string;
};

const RangePicker = ({
  value,
  onChange,
  format = "yyyy-MM-dd",
  showTime,
  timeIntervals = 10,
  disabledDate,
  className = "",
}: RangePickerProps) => {
  const handleStartDateChange = (date: Date) => onChange([dayjs(date), value[1] || dayjs()]);
  const handleEndDateChange = (date: Date) => onChange([value[0] || dayjs(), dayjs(date)]);
  const pickerClassName = "m-0 p-0 text-center h-fit w-full";
  return (
    <div className={twMerge("flex items-center gap-2 p-0 h-9 input input-bordered w-fit", className)}>
      <ReactDatePicker
        className={pickerClassName}
        selected={value[0] && value[0].toDate()}
        selectsStart
        startDate={value[0] && value[0].toDate()}
        endDate={value[1] && value[1].toDate()}
        onChange={handleStartDateChange}
        showTimeSelect={showTime}
        timeIntervals={timeIntervals}
        filterDate={(date) => (disabledDate ? disabledDate(dayjs(date)) : true)}
        dateFormat={format}
      />
      <AiOutlineSwapRight className="text-3xl text-gray-400" />
      <ReactDatePicker
        className={pickerClassName}
        selected={value[1] && value[1].toDate()}
        selectsEnd
        startDate={value[0] && value[0].toDate()}
        endDate={value[1] && value[1].toDate()}
        onChange={handleEndDateChange}
        showTimeSelect={showTime}
        timeIntervals={timeIntervals}
        filterDate={(date) => (disabledDate ? disabledDate(dayjs(date)) : true)}
        dateFormat={format}
      />
    </div>
  );
};

DatePicker.RangePicker = RangePicker;

type TimePickerProps = {
  value: dayjs.Dayjs | null;
  onChange: (value: dayjs.Dayjs) => void;
  format?: string;
  timeIntervals?: number;
  disabledDate?: (date: dayjs.Dayjs) => boolean;
  className?: string;
  disabled?: boolean;
};

const TimePicker = ({
  disabled,
  className,
  value,
  format = "HH:mm",
  onChange,
  timeIntervals = 10,
}: TimePickerProps) => {
  return (
    <ReactDatePicker
      wrapperClassName="inline-block"
      className={twMerge("input input-bordered inline-block w-auto", className)}
      selected={value ? value.toDate() : new Date()}
      onChange={(date: Date) => onChange(dayjs(date))}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={timeIntervals}
      timeCaption="Time"
      dateFormat={format}
      disabled={disabled}
    />
  );
};

DatePicker.TimePicker = TimePicker;
