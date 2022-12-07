import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { gql } from "@shared/data-access";
import {
  Form,
  Card,
  Modal,
  InputNumber,
  Button,
  Input,
  Space,
  DatePicker,
  Select,
  Switch,
  Tag,
  InputRef,
  UploadFile,
  Upload,
} from "antd";
import moment from "moment";
import { useRef, useState } from "react";
import styled from "styled-components";

type TextProps = {
  label?: string | null;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Text = ({ label, value, onChange, placeholder, required, disabled }: TextProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
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
      />
    </Space>
  );
};

type NumberProps = {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
};
export const Number = ({ label, value, onChange, min, max, required, disabled }: NumberProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
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
    </Space>
  );
};

type DoubleNumberProps = {
  label: string;
  value: [number, number] | null;
  onChange: (value: [number, number]) => void;
  required?: boolean;
  disabled?: boolean;
};
export const DoubleNumber = ({ label, value, onChange, required, disabled }: DoubleNumberProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      <Input
        type="number"
        value={value ? value[0] : 0}
        onChange={(e) => onChange([parseInt(e.target.value), value ? value[1] : 0])}
        disabled={disabled}
      />
      <Input
        type="number"
        value={value ? value[1] : 0}
        onChange={(e) => onChange([value ? value[0] : 0, parseInt(e.target.value)])}
        disabled={disabled}
      />
    </Space>
  );
};

type ImageProps = {
  label: string;
  file: gql.File | null;
  addFiles: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
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
  direction = "horizontal",
}: ImageProps) => {
  return (
    <Space style={{ marginTop: 10 }} direction={direction}>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      {file ? (
        <StyledFile>
          <div className={isCircle ? "circle" : "normal"}>
            <img alt={label} src={file.url} height={300} />
          </div>
          <Button onClick={onRemove} disabled={disabled}>
            remove
          </Button>
        </StyledFile>
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
    </Space>
  );
};

const StyledFile = styled.div`
  text-align: center;
  div.circle {
    border-radius: 50%;
    overflow: hidden;
    aspect-ratio: 1 /1;
  }
  button {
    margin-top: 10px;
  }
`;

type ImagesProps = {
  label?: string | null;
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
      <Space>
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
      </Space>
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
  label?: string | null;
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
  label: string;
  value: string | null;
  onChange: (value: string) => void;
};
export const TextArea = ({ label, value, onChange }: TextAreaProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <Input.TextArea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </Space>
  );
};

type SwitchItemProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};
export const SwitchItem = ({ label, checked, onChange }: SwitchItemProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <Switch onChange={onChange} checked={checked} />
    </Space>
  );
};

type RangePickerProps = {
  label: string;
  min?: Date;
  max?: Date;
  openAt: Date | null;
  closeAt: Date | null;
  showTime?: boolean;
  onChange: (openAt: Date | null, closeAt: Date | null) => void;
};
export const RangePicker = ({ label, openAt, min, max, closeAt, onChange, showTime }: RangePickerProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <DatePicker.RangePicker
        showTime={showTime}
        value={openAt && closeAt ? [moment(openAt), moment(closeAt)] : [null, null]}
        disabledDate={(d) => !d || d.isAfter(moment(max)) || d.isSameOrBefore(moment(min))}
        onChange={(e) => {
          onChange(e?.[0] ? new Date(e[0].toDate()) : null, e?.[1] ? new Date(e[1].toDate()) : null);
        }}
      />
    </Space>
  );
};

type DateProps = {
  label: string;
  min?: Date;
  max?: Date;
  date: Date | null;
  showTime?: boolean;
  onChange: (date: Date | null) => void;
};
export const DatePick = ({ label, date, min, max, onChange, showTime }: DateProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <DatePicker
        showTime={showTime}
        value={date ? moment(date) : null}
        onChange={(e) => e && onChange(new Date(e.toDate()))}
      />
    </Space>
  );
};

type Item = { id: string; label: string };
type SelectProps = {
  mode?: "multiple" | "tags";
  label: string;
  items: Item[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
};
export const SelectItem = ({ mode, label, items, value, onChange }: SelectProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <Select mode={mode} style={{ width: 300 }} value={value} onChange={(value) => onChange(value)}>
        {items.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
};

type TagsProps = {
  label?: string | null;
  values: string[] | null;
  onUpdate: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Tags = ({ label, values, onUpdate, placeholder, required, disabled }: TagsProps) => {
  const inputRef = useRef<InputRef>(null);
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
      <Space style={{ marginTop: 10, flexWrap: "wrap" }}>
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
            ref={inputRef}
            type="text"
            size="small"
            className="tag-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onBlur={addTag}
            onPressEnter={addTag}
          />
        ) : (
          <Tag className="site-tag-plus" onClick={() => setInputVisible(true)}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </Space>
    </div>
  );
};

export const Container = styled.div`
  .label {
    width: 100px;
    text-align: right;
    font-weight: bolder;
    span {
      color: #ff6666;
      margin-right: 4px;
    }
  }
`;
