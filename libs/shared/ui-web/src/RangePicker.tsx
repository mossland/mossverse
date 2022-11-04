import { DatePicker } from "antd";
import { PickerComponentClass } from "antd/lib/date-picker/generatePicker/interface";
import { Types } from "libs/shared/ui-web/src";
import moment from "moment";
import { StyledText } from "./styles";

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
      value={openAt && closeAt ? [moment(openAt), moment(closeAt)] : [null, null]}
      disabledDate={(d) => !d || d.isAfter(moment(max)) || d.isSameOrBefore(moment(min))}
      onChange={(e) => {
        onChange(e?.[0] ? e[0].toDate() : null, e?.[1] ? e[1].toDate() : null);
      }}
    />
  );
};
