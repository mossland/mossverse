import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { gql } from "@shared/data-access";
import { InitActionForm, Slice, SliceModel } from "@shared/util-client";
import { Form, DatePicker, Select, Switch, Tag, UploadFile, Upload, Slider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { locationMap, Utils } from "@shared/util";
import { Input } from "@shared/ui-web";
import { twMerge } from "tailwind-merge";

type OnOffProps = {
  label?: ReactNode | string | null;
  value: boolean | null;
  onChange: (value: boolean) => void;
};
export const OnOff = ({ label, value, onChange }: OnOffProps) => {
  return (
    <FieldWrapper>
      {label && <div className="label">{label}</div>}
      <Switch checked={value ?? false} onChange={onChange} />
    </FieldWrapper>
  );
};

type TextProps = {
  label?: ReactNode | string | null;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
  onPressEnter?: () => void;
};
export const Text = ({ label, value, onChange, placeholder, required, disabled, onPressEnter }: TextProps) => {
  return (
    <FieldWrapper>
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      <Input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onPressEnter={onPressEnter}
      />
    </FieldWrapper>
  );
};

type NumberProps = {
  label: ReactNode | string | null;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
};
export const Number = ({ label, value, onChange, min, max, required, disabled }: NumberProps) => {
  return (
    <FieldWrapper>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      <Input
        type="number"
        min={min}
        max={max}
        value={value ?? 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
      />
    </FieldWrapper>
  );
};

type DoubleNumberProps = {
  label?: ReactNode | string | null;
  value: [number, number] | null;
  onChange: (value: [number, number]) => void;
  required?: boolean;
  disabled?: boolean;
};
export const DoubleNumber = ({ label, value, onChange, required, disabled }: DoubleNumberProps) => {
  return (
    <FieldWrapper>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      <Input
        type="number"
        value={value ? value[0] : 0}
        onChange={(e) => onChange([parseFloat(e.target.value), value ? value[1] : 0])}
        disabled={disabled}
      />
      <Input
        type="number"
        value={value ? value[1] : 0}
        onChange={(e) => onChange([value ? value[0] : 0, parseFloat(e.target.value)])}
        disabled={disabled}
      />
    </FieldWrapper>
  );
};

type ImageProps = {
  label?: ReactNode | string | null;
  file: gql.File | null;
  addFiles: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
  renderImage?: (file: gql.File) => ReactNode;
  direction?: "horizontal" | "vertical";
  isCircle?: boolean;
};
export const Img = ({
  file,
  addFiles,
  onRemove,
  label,
  required,
  disabled,
  isCircle,
  renderImage,
  direction = "horizontal",
}: ImageProps) => {
  const uploadFiles: UploadFile[] = file ? [{ uid: file.id, name: file.id, url: file.url }] : [];
  return (
    <FieldWrapper direction={direction}>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      {file ? (
        <div className="text-center">
          <div className={isCircle ? "rounded-full overflow-hidden aspect-square" : "normal"}>
            {renderImage ? (
              renderImage(file)
            ) : (
              <div className="mt-[10px]">
                <Upload listType="picture-card" fileList={uploadFiles} onRemove={onRemove} maxCount={1} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Upload
          multiple
          listType="picture-card"
          onChange={(e) => {
            if (e.file.status !== "uploading" || e.file.percent) return;
            addFiles([e.file.originFileObj] as any);
          }}
          disabled={disabled}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </FieldWrapper>
  );
};

type FileProps = {
  label?: ReactNode | string | null;
  file: gql.File | null;
  addFiles: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
  renderFile?: (file: gql.File) => ReactNode;
  direction?: "horizontal" | "vertical";
  isCircle?: boolean;
};
export const File = ({
  file,
  addFiles,
  onRemove,
  label,
  required,
  disabled,
  isCircle,
  renderFile,
  direction = "horizontal",
}: FileProps) => {
  const uploadFiles: UploadFile[] = file ? [{ uid: file.id, name: file.id, url: file.url }] : [];
  return (
    <FieldWrapper direction={direction}>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      {file ? (
        <div className="text-center">
          <div className={isCircle ? "rounded-full overflow-hidden aspect-square" : "normal"}>
            {renderFile ? (
              renderFile(file)
            ) : (
              <div className="mt-[10px]">
                <Upload listType="picture-card" fileList={uploadFiles} onRemove={onRemove} maxCount={1} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Upload
          multiple
          listType="text"
          onChange={(e) => {
            if (e.file.status !== "uploading" || e.file.percent) return;
            addFiles([e.file.originFileObj] as any);
          }}
          disabled={disabled}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </FieldWrapper>
  );
};

type ImagesProps = {
  label?: ReactNode | string | null;
  files: gql.File[] | null;
  addFiles: (value: FileList) => Promise<void>;
  onUpdate: (values: gql.File[]) => void;
  secret?: boolean;
  disabled?: boolean;
};
export const Imgs = ({ label, files, addFiles, onUpdate, disabled }: ImagesProps) => {
  const uploadFiles: UploadFile[] =
    files?.map((file) => ({
      uid: file.id,
      name: file.id,
      url: file.url,
    })) ?? [];
  return (
    <div>
      <FieldWrapper className="flex-wrap">
        {label && <div className="label">{label}</div>}
        {uploadFiles.map((uploadFile, idx) => (
          <Upload
            key={uploadFile.uid}
            listType="picture-card"
            fileList={[uploadFile]}
            onRemove={() => onUpdate(files?.filter((f, i) => i !== idx) ?? [])}
          />
        ))}
        <Upload
          multiple
          listType="picture-card"
          onChange={(e) => {
            if (e.file.status !== "uploading" || e.file.percent) return;
            addFiles([e.file.originFileObj] as any);
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </FieldWrapper>
    </div>
  );
};

type EmailProps = {
  value: string | null;
  onChange: (value: string) => void;
};
export const Email = ({ value, onChange }: EmailProps) => {
  return (
    <Form.Item label="email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Form.Item>
  );
};
type IDProps = {
  value: string | null;
  onChange: (value: string) => void;
};
export const ID = ({ value, onChange }: IDProps) => {
  return (
    <Form.Item label="accountId" name="accountId" rules={[{ required: true, message: "Please input your accountId!" }]}>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Form.Item>
  );
};
type PasswordProps = {
  value: string | null;
  label?: ReactNode | string | null;
  onChange: (value: string) => void;
};
export const Password = ({ label, value, onChange }: PasswordProps) => {
  return (
    <Form.Item
      label={label || "password"}
      name="password"
      rules={[{ required: true, message: "Please input your password!" }]}
    >
      <Input.Password value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Form.Item>
  );
};

type TextAreaProps = {
  className?: string;
  label?: ReactNode | string | null;
  value: string | null;
  onChange: (value: string) => void;
  row?: number;
};
export const TextArea = ({ className, label, value, onChange, row = 3 }: TextAreaProps) => {
  return (
    <div className={className}>
      <div className="label">{label}</div>
      <textarea
        className="w-full textarea textarea-bordered"
        rows={row}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

type SwitchItemProps = {
  label?: ReactNode | string | null;
  checked: boolean;
  onChange: (value: boolean) => void;
};
export const SwitchItem = ({ label, checked, onChange }: SwitchItemProps) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <Switch onChange={onChange} checked={checked} />
    </FieldWrapper>
  );
};

type RangePickerProps = {
  label?: ReactNode | string | null;
  min?: Dayjs;
  max?: Dayjs;
  openAt: Dayjs | null;
  closeAt: Dayjs | null;
  showTime?: boolean;
  onChange: (openAt: Dayjs | null, closeAt: Dayjs | null) => void;
};
export const RangePicker = ({ label, openAt, min, max, closeAt, onChange, showTime }: RangePickerProps) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <DatePicker.RangePicker
        showTime={showTime}
        value={openAt && closeAt ? [dayjs(openAt), dayjs(closeAt)] : [null, null]}
        disabledDate={(d) => !d || d.isAfter(dayjs(max)) || d.isBefore(dayjs(min))}
        onChange={(e) => onChange(e?.[0] ? e[0] : null, e?.[1] ? e[1] : null)}
      />
    </FieldWrapper>
  );
};

type DateProps = {
  label?: ReactNode | string | null;
  min?: Dayjs;
  max?: Dayjs;
  date: Dayjs | null;
  showTime?: boolean;
  onChange: (date: Dayjs | null) => void;
};
export const DatePick = ({ label, date, min, max, onChange, showTime }: DateProps) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <DatePicker
        showTime={showTime}
        disabledDate={(d) => !d || (!!max && d.isAfter(dayjs(max))) || (!!min && d.isBefore(dayjs(min)))}
        value={date ? dayjs(date) : null}
        onChange={(e) => e && onChange(!showTime ? e.set("hour", 0).set("minute", 0).set("second", 0) : e)}
      />
    </FieldWrapper>
  );
};

type SelectProps<I> = {
  mode?: "multiple" | "tags";
  label?: ReactNode | string | null;
  items: any; //(any | Item<I>)[];
  value: I | I[] | null;
  disabled?: boolean;
  onChange: (value: I | I[]) => void;
};
export const SelectItem = ({ mode, label, items, value, onChange, disabled }: SelectProps<any>) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <Select
        mode={mode}
        style={{ width: 500 }}
        value={value}
        onChange={(value) => onChange(value)}
        disabled={disabled}
      >
        {items.map((item) =>
          typeof item === "string" ? (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ) : (
            <Select.Option key={item.id} value={item.id}>
              {item.label}
            </Select.Option>
          )
        )}
      </Select>
    </FieldWrapper>
  );
};

type SliderItem = { id: number; label: string };
type SliderSelectProps = {
  label?: ReactNode | string | null;
  items: SliderItem[];
  value: number;
  disabled?: boolean;
  onChange: (value) => void;
};
export const SliderSelectItem = ({ label, items, value, onChange, disabled }: SliderSelectProps) => {
  return (
    <FieldWrapper>
      {label && <div className="label">{label}</div>}
      <Slider
        style={{ width: 200 }}
        min={0}
        max={items?.length - 1}
        dots
        onChange={(value) => onChange(value)}
        value={typeof value === "number" ? value : 0}
        tooltip={{ formatter: (current) => items?.find((val) => val?.id === current)?.label }}
        disabled={disabled}
      />
      <div className="ml-1 text-xs">{items?.find((val) => val?.id === value)?.label}</div>
    </FieldWrapper>
  );
};

type TagsProps = {
  label?: ReactNode | string | null;
  values: string[] | null;
  onUpdate: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Tags = ({ label, values, onUpdate, placeholder, required, disabled }: TagsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [tag, setTag] = useState("");
  const addTag = () => {
    if (!tag.length) return;
    onUpdate([...(values ?? []), tag]);
    setInputVisible(false);
    setTag("");
  };
  return (
    <div>
      <FieldWrapper>
        {label && (
          <div className="label">
            {required && <span>*</span>}
            {label}
          </div>
        )}
        {values &&
          values.map((val, idx) => (
            <Tag closable onClose={() => onUpdate(values.filter((v, i) => i !== idx))} key={val}>
              {val}
            </Tag>
          ))}
        {inputVisible ? (
          <Input
            inputRef={inputRef}
            type="text"
            className="tag-input input-sm"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onBlur={addTag}
            onPressEnter={addTag}
          />
        ) : (
          <Tag className="site-tag-plus hover:cursor-pointer" onClick={() => setInputVisible(true)}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </FieldWrapper>
    </div>
  );
};

interface ParentProps<T extends string, State, M, L> {
  label?: ReactNode | string | null;
  disabled?: boolean;
  required?: boolean;
  init?: InitActionForm<M>;
  value: L | null;
  onChange: (value: L | null) => void;
  slice: Slice<T, State>;
  width?: number | string;
  renderOption: (model: L) => string;
}

export const Parent = <T extends string, State, M extends { id: string }, L extends { id: string }>({
  label,
  required,
  disabled,
  init,
  slice,
  value,
  width = "100%",
  onChange,
  renderOption,
}: ParentProps<T, State, M, L>) => {
  const modelList = slice.use[`${slice.refName}List` as any]();
  useEffect(() => {
    slice.do[`init${Utils.capitalize(slice.refName)}`](init);
  }, []);
  return (
    <FieldWrapper className="my-2">
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      <div className="min-w-[200px] ">
        {modelList === "loading" ? (
          <Select style={{ width }} loading />
        ) : (
          <Select
            value={value?.id}
            style={{ minWidth: "100%" }}
            allowClear
            disabled={disabled}
            onChange={(id) => onChange(modelList.find((model) => model.id === id) ?? null)}
          >
            {modelList.map((model: any) => (
              <Select.Option key={model.id} value={model.id}>
                {renderOption(model)}
              </Select.Option>
            ))}
          </Select>
        )}
      </div>
    </FieldWrapper>
  );
};

interface ChildrenProps<T extends string, State, M extends { id: string }, L> {
  label?: ReactNode | string | null;
  disabled?: boolean;
  required?: boolean;
  init?: InitActionForm<M>;
  values: L[];
  onChange: (value: L[]) => void;
  slice: Slice<T, State>;
  renderOption: (model: L) => string;
}

export const Children = <T extends string, State, M extends { id: string }, L extends { id: string }>({
  label,
  disabled,
  required,
  init,
  slice,
  values,
  onChange,
  renderOption,
}: ChildrenProps<T, State, M, L>) => {
  const modelList = slice.use[`${slice.refName}List` as any]();
  useEffect(() => {
    slice.do[`init${Utils.capitalize(slice.refName)}`](init);
  }, []);
  return (
    <FieldWrapper>
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      {modelList === "loading" ? (
        <Select style={{ width: "100%" }} loading />
      ) : (
        <Select
          mode="multiple"
          value={values.map((val) => val.id)}
          style={{ width: 300 }}
          allowClear
          onChange={(ids) => onChange(modelList.filter((model) => ids.includes(model.id)))}
        >
          {modelList.map((model: any) => (
            <Select.Option key={model.id} value={model.id}>
              {renderOption(model)}
            </Select.Option>
          ))}
        </Select>
      )}
    </FieldWrapper>
  );
};

type CoordinateProps = {
  label?: ReactNode | string | null;
  coordinate: gql.Coordinate | null;
  mapKey: string;
  onChange: (coordinate: gql.Coordinate) => void;
};
export const Coordinate = ({ label, coordinate, mapKey, onChange }: CoordinateProps) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: mapKey }}
        defaultCenter={{
          lat: coordinate?.coordinates[1] ?? 59.95,
          lng: coordinate?.coordinates[0] ?? 30.33,
        }}
        defaultZoom={0}
        resetBoundsOnResize={true}
        options={{ mapId: "d4d8c530880d0007", minZoom: 2 }}
        onClick={(val) => onChange({ type: "Point", coordinates: [val.lng, val.lat] })}
      >
        {coordinate && <Marker lat={coordinate.coordinates[1]} lng={coordinate.coordinates[0]} />}
      </GoogleMapReact>
    </FieldWrapper>
  );
};
type MarkerProps = { isMount?: boolean; lat?: number; lng?: number };
export const Marker = ({ isMount = true, lat, lng }: MarkerProps) => {
  return <div></div>;
};

type KoreanCityDistrictProps = {
  className?: string;
  city: string | null;
  onChangeCity: (city?: string) => void;
  district: string | null;
  onChangeDistrict: (distirct?: string) => void;
  disabled?: boolean;
};
export const KoreanCityDistrict = ({
  className,
  city,
  onChangeCity,
  district,
  disabled = false,
  onChangeDistrict,
}: KoreanCityDistrictProps) => {
  return (
    <div className={twMerge(`flex flex-wrap items-center gap-2`, className)}>
      <Select
        disabled={disabled}
        placeholder="시/도"
        className="w-[100px]"
        options={Object.keys(locationMap).map((key) => ({ value: key, label: key }))}
        value={city}
        onChange={(city) => onChangeCity(city.toString())}
      />
      <Select
        disabled={disabled}
        placeholder="상세지역"
        className="w-[100px]"
        options={city ? locationMap[city].map((value) => ({ value, label: value })) : []}
        value={[district]}
        onChange={(district) => onChangeDistrict(district.toString() === "상세지역" ? undefined : district.toString())}
      />
    </div>
  );
};

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="[&_.label]:w-full [&_.label]:text-right [&_.label]:font-bold [&_.label_span]:text-[#ff6666] [&_.label_span]:mr-[4px] ">
      {children}
    </div>
  );
};

const FieldWrapper = ({
  children,
  className = "",
  direction = "horizontal",
}: {
  children: ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
}) => {
  const directionClassName = direction === "horizontal" ? "flex-row" : "flex-col w-fit";

  return (
    <div className={twMerge("inline-block mt-2 ml-2", directionClassName, className)}>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};
