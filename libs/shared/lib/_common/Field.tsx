"use client";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineCloseCircle,
  AiOutlineDislike,
  AiOutlineLike,
  AiOutlinePlus,
  AiTwotoneEnvironment,
} from "react-icons/ai";
import { DatePicker, Input, Select, Upload, fetch, st, usePage } from "@shared/client";
import { InitActionForm, Utils, locationMap, useInterval } from "@util/client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import dayjs, { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
const GoogleMapReact = dynamic(() => import("google-map-react"), { ssr: false });

type OnOffProps = {
  label?: ReactNode | string | null;
  value: boolean | null;
  onChange: (value: boolean) => void;
};
export const OnOff = ({ label, value, onChange }: OnOffProps) => {
  return (
    <FieldWrapper>
      {label && <div className="label">{label}</div>}
      <input type="checkbox" className="toggle" checked={value ?? false} onChange={(e) => onChange(e.target.checked)} />
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
  label?: ReactNode | string | null;
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
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      <input
        type="number"
        className="input input-bordered"
        min={min}
        max={max}
        value={value ?? 0}
        onChange={(e) => onChange(e.target.valueAsNumber)}
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
  file: fetch.File | null;
  setFile?: (file: fetch.File) => void;
  addFiles: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
  renderImage?: (file: fetch.File) => ReactNode;
  direction?: "horizontal" | "vertical";
  isCircle?: boolean;
};
export const Img = ({
  file,
  addFiles,
  setFile,
  onRemove,
  label,
  required,
  disabled,
  isCircle,
  renderImage,
  direction = "horizontal",
}: ImageProps) => {
  useInterval(async () => {
    if (file?.status !== "uploading" || !setFile) return;
    setFile(await fetch.getFile(file.id));
  }, 3000);
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
                <Upload listType="picture-card" fileList={[file]} onRemove={onRemove} maxCount={1} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Upload
          multiple
          listType="picture-card"
          onChange={(file) => {
            addFiles([file] as any);
          }}
          disabled={disabled}
        >
          <div>
            <AiOutlinePlus />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </FieldWrapper>
  );
};

type FileProps = {
  className?: string;
  label?: ReactNode | string | null;
  file: fetch.File | null;
  setFile?: (file: fetch.File) => void;
  addFiles: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
  renderFile?: (file: fetch.File) => ReactNode;
  direction?: "horizontal" | "vertical";
  isCircle?: boolean;
};
export const File = ({
  className,
  file,
  setFile,
  addFiles,
  onRemove,
  label,
  required,
  disabled,
  isCircle,
  renderFile,
  direction = "horizontal",
}: FileProps) => {
  useInterval(async () => {
    if (file?.status !== "uploading" || !setFile) return;
    setFile(await fetch.getFile(file.id));
  }, 3000);
  return (
    <FieldWrapper className={className} direction={direction}>
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
                {/* <Upload listType="picture-card" fileList={uploadFiles} onRemove={onRemove} maxCount={1} /> */}
                <Upload listType="text" fileList={[file]} onRemove={onRemove} maxCount={1} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Upload
          multiple
          listType="text"
          onChange={(file) => {
            addFiles([file] as any);
          }}
          disabled={disabled}
        >
          <div>
            <AiOutlinePlus />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </FieldWrapper>
  );
};

type ImagesProps = {
  className?: string;
  label?: ReactNode | string | null;
  files: fetch.File[] | null;
  setFiles?: (files: fetch.File[]) => void;
  addFiles: (value: FileList) => Promise<void>;
  onUpdate: (values: fetch.File[]) => void;
  secret?: boolean;
  disabled?: boolean;
};
export const Imgs = ({ className, label, files, addFiles, onUpdate, disabled }: ImagesProps) => {
  useInterval(async () => {
    if (!files) return;
    const uploadingFiles = files.filter((f) => f.status === "uploading");
    if (!uploadingFiles?.length) return;
    const newFiles = await Promise.all(uploadingFiles.map(async (f) => await fetch.getFile(f.id)));
    onUpdate(files.map((f) => newFiles.find((nf) => nf.id === f.id) ?? f));
  }, 3000);
  return (
    <FieldWrapper className={twMerge("flex-wrap", className)}>
      {label && <div className="label">{label}</div>}
      <Upload
        fileList={files ?? undefined}
        listType="picture-card"
        onChange={(file) => {
          addFiles([file] as any);
        }}
        onRemove={(file) => onUpdate(files?.filter((f) => f.id !== file.id) ?? [])}
      >
        <div className="flex flex-col items-center ">
          <AiOutlinePlus />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </FieldWrapper>
  );
};

type EmailProps = {
  value: string | null;
  onChange: (value: string) => void;
};
export const Email = ({ value, onChange }: EmailProps) => {
  // return (
  //   <Form.Item label="email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
  //     <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
  //   </Form.Item>
  // );
  return <Input type="email" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
};
type IDProps = {
  value: string | null;
  onChange: (value: string) => void;
};
export const ID = ({ value, onChange }: IDProps) => {
  return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
};
type PasswordProps = {
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
};
export const Password = ({ className, value, onChange }: PasswordProps) => {
  return <Input.Password className={className} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
};

type TextAreaProps = {
  className?: string;
  label?: ReactNode | string | null;
  value: string | null;
  placeholder?: string;
  onChange: (value: string) => void;
  row?: number;
};
export const TextArea = ({ className, label, value, placeholder, onChange, row = 3 }: TextAreaProps) => {
  return (
    <div className={className}>
      <div className="label">{label}</div>
      <textarea
        className="w-full textarea textarea-bordered"
        rows={row}
        placeholder={placeholder}
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
      <input type="checkbox" className="toggle" checked={checked} onChange={(e) => onChange(e.target.checked)} />
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
  mode?: "multiple";
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

type TagsProps = {
  className?: string;
  label?: ReactNode | string | null;
  values: string[] | null;
  onUpdate: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Tags = ({ className, label, values, onUpdate, placeholder, required, disabled }: TagsProps) => {
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
    <FieldWrapper className={className}>
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      {values &&
        values.map((val, idx) => (
          <span className="items-center gap-2 badge badge-outline">
            {val}
            <AiOutlineCloseCircle
              className="cursor-pointer"
              onClick={() => onUpdate(values.filter((v, i) => i !== idx))}
            />
          </span>
        ))}
      {inputVisible ? (
        <Input
          inputRef={inputRef}
          type="text"
          className="input input-xs"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onBlur={addTag}
          onPressEnter={addTag}
        />
      ) : (
        <span
          className="items-center gap-2 badge badge-outline hover:cursor-pointer"
          onClick={() => setInputVisible(true)}
        >
          <AiOutlinePlus /> New Tag
        </span>
      )}
    </FieldWrapper>
  );
};

export interface ParentProps<T extends string, State, M, L> {
  label?: ReactNode | string | null;
  disabled?: boolean;
  required?: boolean;
  init?: InitActionForm<M>;
  value: L | null;
  onChange: (value: L | null) => void;
  sliceName: string;
  width?: number | string;
  sortOption?: (a: L, b: L) => number;
  renderOption: (model: L) => string;
}

export const Parent = <T extends string, State, M extends { id: string }, L extends { id: string }>({
  label,

  required,
  disabled,
  init,
  sliceName,
  value,
  width = "100%",
  onChange,
  sortOption,
  renderOption,
}: ParentProps<T, State, M, L>) => {
  const modelMap = st.slice[sliceName].use[`${sliceName}Map` as any]();
  // const modelMap = st.use[`${sliceName}Map` as any]();
  useEffect(() => {
    !value && st.slice[sliceName].do[`init${Utils.capitalize(sliceName)}`](init);
    // (!value || modelMap === "loading") && st.do[`init${Utils.capitalize(sliceName)}`](init);
  }, [value]);
  return (
    <FieldWrapper className="w-full my-2">
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      <div className="min-w-[200px] w-full ">
        {modelMap === "loading" ? (
          <Select className="w-full" value="" style={{ width }} loading>
            <div></div>
          </Select>
        ) : (
          <Select
            className="w-full"
            value={value?.id}
            allowClear
            disabled={disabled}
            onChange={(id) => onChange([...modelMap.values()].find((model) => model.id === id) ?? null)}
          >
            {(sortOption ? [...modelMap.values()].sort(sortOption) : [...modelMap.values()]).map((model: any) => (
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

export interface ChildrenProps<T extends string, State, M extends { id: string }, L> {
  label?: ReactNode | string | null;
  disabled?: boolean;
  required?: boolean;
  init?: InitActionForm<M>;
  values: L[];
  onChange: (value?: L[]) => void;
  sliceName: string;
  renderOption: (model: L) => string;
}

export const Children = <T extends string, State, M extends { id: string }, L extends { id: string }>({
  label,
  disabled,
  required,
  init,
  sliceName,
  values,
  onChange,
  renderOption,
}: ChildrenProps<T, State, M, L>) => {
  const modelMap = st.slice[sliceName].use[`${sliceName}Map` as any]();
  useEffect(() => {
    st.slice[sliceName].do[`init${Utils.capitalize(sliceName)}`](init);
  }, []);
  return (
    <FieldWrapper>
      {label && (
        <div className="label">
          {required && <span>*</span>}
          {label}
        </div>
      )}
      {modelMap === "loading" ? (
        <Select style={{ width: "100%" }} value="" loading>
          <div></div>
        </Select>
      ) : (
        <Select
          mode="multiple"
          value={values.map((val) => val.id)}
          style={{ width: 300 }}
          allowClear
          onChange={(ids) => onChange([...modelMap.values()].filter((model) => ids.includes(model.id)))}
        >
          {[...modelMap.values()].map((model: any) => (
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
  coordinate: fetch.Coordinate | null;
  mapKey: string;
  onChange: (coordinate: fetch.Coordinate) => void;
};
export const Coordinate = ({ label, coordinate, mapKey, onChange }: CoordinateProps) => {
  return (
    <FieldWrapper>
      <div className="label">{label}</div>
      <div style={{ height: 300, width: 300 }}>
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
      </div>
    </FieldWrapper>
  );
};
type MarkerProps = { isMount?: boolean; lat?: number; lng?: number };
export const Marker = ({ isMount = true, lat, lng }: MarkerProps) => {
  return <AiTwotoneEnvironment className="text-2xl text-white" />;
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
      <Select disabled={disabled} placeholder="시/도" value={city} onChange={(city) => onChangeCity(city.toString())}>
        {Object.keys(locationMap).map((key) => (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        ))}
      </Select>
      <Select
        disabled={disabled}
        placeholder="상세지역"
        value={[district]}
        onChange={(district) => onChangeDistrict(district.toString() === "상세지역" ? undefined : district.toString())}
      >
        {city &&
          locationMap[city].map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
      </Select>
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
export interface LikeDislikeProps {
  className?: string;
  like: number;
  totalLike: number;
  onLike?: () => void;
  onResetlike?: () => void;
  onDislike?: () => void;
}
export const LikeDislike = ({ className, like, totalLike, onLike, onResetlike, onDislike }: LikeDislikeProps) => {
  const { l } = usePage();
  const [state, setState] = useState({ total: totalLike, like: like > 0, dislike: like < 0 });
  return (
    <div className={twMerge(`flex gap-2`, className)}>
      <button
        className={`mx-1 btn gap-2 flex items-center ${state.like ? "btn-primary" : "btn-outline"}`}
        onClick={() => {
          setState(
            state.like
              ? { total: state.total - 1, like: false, dislike: false }
              : { total: state.total + 1, like: true, dislike: false }
          );
          state.like ? onLike?.() : onResetlike?.();
        }}
      >
        {state.like ? <AiFillLike /> : <AiOutlineLike />}
        <span className="flex gap-2 ml-1">
          {l("shared.like")} {state.total}
        </span>
      </button>
      <button
        className={`btn btn-square ${state.dislike ? "btn-primary" : "btn-outline"}`}
        onClick={() => {
          setState(
            state.dislike
              ? { total: state.total, like: false, dislike: false }
              : { total: state.total - (state.like ? 1 : 0), like: false, dislike: true }
          );
          state.dislike ? onResetlike?.() : onDislike?.();
        }}
      >
        {state.dislike ? <AiFillDislike /> : <AiOutlineDislike />}
      </button>
    </div>
  );
};
export interface LikeProps {
  className?: string;
  like: number;
  totalLike: number;
  likedClassName?: string;
  unlikedClassName?: string;
  onLike?: () => void;
  onResetlike?: () => void;
}
export const Like = ({
  className,
  like,
  totalLike,
  onLike,
  onResetlike,
  likedClassName = "btn-primary",
  unlikedClassName = "btn-ghost bg-white/50",
}: LikeProps) => {
  const [state, setState] = useState({ total: totalLike, like: like > 0 });
  return (
    <div
      className={twMerge(
        `text-lg flex items-center justify-center gap-1 pt-0.5 rounded-lg btn hover:scale-105 
          ${state.like ? likedClassName : unlikedClassName}
          `,
        className
      )}
      onClick={async (e) => {
        e.stopPropagation();
        setState(state.like ? { total: state.total - 1, like: false } : { total: state.total + 1, like: true });
        state.like ? onLike?.() : onResetlike?.();
      }}
    >
      {state.like ? <AiFillLike className="-mt-1" /> : <AiOutlineLike className="-mt-1" />} {state.total}
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
    <div className={twMerge("inline-block", directionClassName, className)}>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
