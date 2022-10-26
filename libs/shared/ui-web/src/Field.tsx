import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { types } from "@shared/data-access";
import { Form, Card, Modal, InputNumber, Button, Input, Space, DatePicker, Select, Switch } from "antd";
import moment from "moment";
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
        onChange={(e) => onChange(parseInt(e.target.value))}
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
  value: types.File | null;
  onChange: (value: FileList) => void;
  onRemove: () => void;
  required?: boolean;
  disabled?: boolean;
};
export const Img = ({ value, onChange, onRemove, label, required, disabled }: ImageProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      {value ? (
        <>
          <img alt={label} src={value.url} height={300} />
          <Button onClick={onRemove} disabled={disabled}>
            remove
          </Button>
        </>
      ) : (
        <input type="file" onChange={(e) => e.target.files && onChange(e.target.files)} disabled={disabled} />
      )}
    </Space>
  );
};

type ImagesProps = {
  label?: string | null;
  files: types.File[] | null;
  addFiles: (value: FileList) => Promise<types.File[]>;
  onUpdate: (values: types.File[]) => void;
  secret?: boolean;
  disabled?: boolean;
};
export const Imgs = ({ label, files, addFiles, onUpdate, disabled }: ImagesProps) => {
  return (
    <>
      <Space style={{ marginTop: 10 }}>
        {label && <div className="label">{label}</div>}
        <input
          type="file"
          onChange={async (e) => {
            if (!e.target.files) return;
            const fs = await addFiles(e.target.files);
            onUpdate([...(files ?? []), ...fs]);
          }}
          disabled={disabled}
        />
      </Space>
      {files &&
        files.map((file, idx) => (
          <>
            <img alt={label ?? ""} src={file.url} height={300} />
            <Button onClick={() => onUpdate(files.filter((f, i) => i !== idx))} disabled={disabled}>
              remove
            </Button>
          </>
        ))}
    </>
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
  onChange: (value: string) => void;
};
export const Password = ({ value, onChange }: PasswordProps) => {
  return (
    <Form.Item label="password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
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
      <Input.TextArea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)} />
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
  onChange: (openAt: Date | null, closeAt: Date | null) => void;
};
export const RangePicker = ({ label, openAt, min, max, closeAt, onChange }: RangePickerProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <DatePicker.RangePicker
        value={openAt && closeAt ? [moment(openAt), moment(closeAt)] : [null, null]}
        disabledDate={(d) => !d || d.isAfter(moment(max)) || d.isSameOrBefore(moment(min))}
        onChange={(e) => {
          onChange(e?.[0] ? e[0].toDate() : null, e?.[1] ? e[1].toDate() : null);
        }}
      />
    </Space>
  );
};

type Item = { id: string; label: string };
type SelectProps = {
  label: string;
  items: Item[];
  value: string | null;
  onChange: (value: string) => void;
};
export const SelectItem = ({ label, items, value, onChange }: SelectProps) => {
  return (
    <Space style={{ marginTop: 10 }}>
      <div className="label">{label}</div>
      <Select value={value} onChange={(value) => onChange(value)}>
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
  value: string | null;
  values: string[] | null;
  onChange: (value: string) => void;
  onUpdate: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Tags = ({ label, value, values, onChange, onUpdate, placeholder, required, disabled }: TagsProps) => {
  return (
    <>
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
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            if (!value || !value.length) return;
            onChange("");
            onUpdate([...(values ?? []), value]);
          }}
        />
      </Space>
      {values &&
        values.map((val, idx) => (
          <div>
            {val}
            <Button icon={<CloseOutlined />} onClick={() => onUpdate(values.filter((v, i) => i !== idx))} />
          </div>
        ))}
    </>
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
