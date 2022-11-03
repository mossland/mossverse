import styled, { keyframes } from "styled-components";
import { KlaytnIcon } from "../common";

type KlaytnButtonProps = {
  onClick: () => void;
};
export const KlaytnButton = ({ onClick }: KlaytnButtonProps) => (
  <Button onClick={onClick}>
    <KlaytnIcon />
    <div style={{ marginLeft: 20 }}>Login to Klaytn</div>
  </Button>
);
const Button = styled.button`
  width: 500px;
  height: auto;
  padding-left: 30px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  align-items: center;
  justify-content: flex-start;
  color: white;
  background: #8f806a;
  display: flex;
  border-radius: 10px;
  transition: 0.3s;

  @media screen and (max-width: 800px) {
    width: 260px;
    height: 50px;
    padding-left: 30px;
    padding-right: 7px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-bottom: 10px;
    font-size: 16px;
    align-items: center;
    justify-content: flex-start;
    color: white;
    background: #8f806a;
    display: flex;
    border-radius: 10px;
  }

  :hover {
    opacity: 0.8;
    /* background: #3ed06c; */
  }
`;
