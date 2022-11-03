// ! This File Needs to be Refactor
import styled from "styled-components";
import { store } from "@shared/data-access";
import { darken } from "polished";

type MetaLoginButtonProps = {
  title: string;
  color?: string;
};
export const MetaLoginButton = ({ title }: MetaLoginButtonProps) => {
  const openModal = () => store.keyring.setState({ isOpenModal: true });
  return <Button onClick={openModal}>{title}</Button>;
};
const Button = styled.button`
  display: block;
  /* width: 370px; */
  width: 100%;
  padding: 10px;
  margin-bottom: 30px;
  font-size: 22px;
  color: #000;
  background-color: #66fef0;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #000;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.3, "#66fef0")};
  }

  @media screen and (max-width: 800px) {
    /* width: 260px; */
    height: 50px;
    margin-top: 10px;
    padding: 7px;
    margin-bottom: 10px;
    font-size: 16px;
  }
`;
