import styled, { keyframes } from "styled-components";
import { darken } from "polished";

type GuestButtonProps = {
  onClick: () => void;
};
export const GuestButton = ({ onClick }: GuestButtonProps) => (
  <Button onClick={onClick}>
    <div>Start as a Guest</div>
  </Button>
);

const Button = styled.button`
  display: block;
  width: 370px;
  padding: 10px;
  margin-bottom: 30px;
  font-size: 22px;
  color: #000;
  background-color: white;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #000;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.3, "white")};
  }

  @media screen and (max-width: 800px) {
    width: 260px;
    height: 50px;
    padding: 7px;
    margin-bottom: 10px;
    font-size: 16px;
  }
`;
