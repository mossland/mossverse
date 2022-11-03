import { useEffect } from "react";
import styled from "styled-components";

export const Kicked = () => {
  return (
    <Container>
      <div className="text">You are kicked</div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4b4947;

  .text {
    color: white;
    font-size: 40px;
  }
`;
