import styled from "styled-components";
import { Container } from "./Container";

export const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <></>
      </Container>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #666a73;
  color: #fff;
  padding: 3rem 0;
`;
