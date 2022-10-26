import styled, { keyframes } from "styled-components";
import { MetamaskIcon, LuniverseIcon } from "../common";

type ConnectLuniverseProps = {
  onClick: () => void;
};
export const ConnectLuniverse = ({ onClick }: ConnectLuniverseProps) => (
  <Button onClick={onClick}>
    <LuniverseIcon />
    <div style={{ marginLeft: 20 }}>Login to Luniverse</div>
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
  background: #3668f5;
  display: flex;
  border-radius: 10px;
  transition: 0.3s;

  @media screen and (max-width: 800px) {
    width: 260px;
    height: auto;
    padding-left: 30px;
    padding-right: 7px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-bottom: 10px;
    font-size: 16px;
    align-items: center;
    justify-content: flex-start;
    color: white;
    background: #f7a252;
    display: flex;
    border-radius: 10px;
  }

  :hover {
    opacity: 0.8;
    /* background: #3ed06c; */
  }
`;
