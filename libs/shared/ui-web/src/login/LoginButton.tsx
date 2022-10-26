import styled from "styled-components";
import { keyringStore } from "@shared/data-access";
import { darken } from "polished";

type LoginButtonProps = {
  title: string;
  color?: string;
};
export const LoginButton = ({ title }: LoginButtonProps) => {
  const openModal = () => keyringStore.setState({ isOpenModal: true });
  return <Button onClick={openModal}>{title}</Button>;
};
const Button = styled.button`
  display: block;
  /* width: 370px; */
  width: 100%;
  padding: 8px 16px;
  /* margin-bottom: 30px; */
  font-size: 20px;
  color: #000;
  background-color: #ffe177;
  text-align: center;
  border-radius: 6px;
  /* border: 2px solid #000; */
  border-width: 0px;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.3, "#FFE177")};
  }

  @media screen and (max-width: 800px) {
    /* width: 260px; */
    /* height: 50px; */
    height: 24px;
    margin-top: 4px;
    padding: 0px;
    margin-bottom: 10px;
    font-size: 14px;
  }
`;
