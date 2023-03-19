import { DatePicker } from "antd";
import dayjs from "dayjs";

type RangePickerProps = {
  className?: string;
  min: Date;
  max: Date;
  openAt: Date;
  closeAt: Date;
  onChange: (openAt: Date | null, closeAt: Date | null) => void;
};

export const RangePicker = <T,>({ className, min, max, openAt, closeAt, onChange }: RangePickerProps) => {
  return (
    <DatePicker.RangePicker
      className={className}
      value={openAt && closeAt ? [dayjs(openAt), dayjs(closeAt)] : [null, null]}
      disabledDate={(d) => !d || d.isAfter(dayjs(max)) || d.isBefore(dayjs(min))}
      onChange={(e) => {
        onChange(e?.[0] ? e[0].toDate() : null, e?.[1] ? e[1].toDate() : null);
      }}
    />
  );
};
