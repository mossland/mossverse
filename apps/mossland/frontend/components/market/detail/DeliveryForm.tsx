import { UploadOutlined } from "@ant-design/icons";
import { types } from "@shared/data-access";
import { Form, Card, Modal, InputNumber, Button, Input } from "antd";
import styled from "styled-components";

type TextProps = {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  secret?: boolean;
  disabled?: boolean;
};
export const Text = ({ label, value, onChange, placeholder, required, disabled }: TextProps) => {
  return (
    <FormBox>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      <Input
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </FormBox>
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
    <FormBox>
      <div className="label">
        {required && <span>*</span>}
        {label}
      </div>
      <Input
        className="input"
        type="number"
        min={min}
        max={max}
        value={value ?? 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
      />
    </FormBox>
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
    <>
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
    </>
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
    <>
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
export const FormBox = styled.div`
  .label {
    /* width: 100px;
    text-align: right;
    font-weight: bolder; */
    span {
      color: #ff6666;
      margin-right: 4px;
    }
  }
  input {
    font-size: 20px;
    border: 1px solid #9a9a9a;
    border-radius: 4px;
    width: 100%;
    padding: 1px 4px;
  }
  margin-bottom: 12px;
`;
