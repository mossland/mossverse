import styled from "styled-components";
import { darken } from "polished";

type ConnectButtonProps = {
  title: string;
  fontColor?: string;
  backgroundColor?: string;
  icon?: JSX.Element;
  onClick: () => void | Promise<void>;
};
export const ConnectButton = ({ title, fontColor, backgroundColor, icon, onClick }: ConnectButtonProps) => (
  <Button onClick={onClick} backgroundColor={backgroundColor}>
    {icon}
    <div style={{ marginLeft: icon ? 8 : 0, color: fontColor }}>{title}</div>
  </Button>
);

const Button = styled.button<{ backgroundColor?: string }>`
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 22px;
  color: #000;
  background-color: ${(props) => props.backgroundColor ?? "white"};
  border-radius: 10px;
  border: 2px solid #000;
  transition: 0.5s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => darken(0.1, props.backgroundColor ?? "white")};
  }
`;
