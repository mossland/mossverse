import styled from "styled-components";

export const StyledEmptyList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 143px);
  font-size: 22px;
`;

export const StyledList = styled.div`
  padding: 20px 33px;
  display: grid;
  height: calc(100vh - 143px);
  overflow-y: scroll;
  flex-wrap: wrap;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    height: calc(100vh - 100px);
  }
  align-items: flex-start;
  grid-gap: 10px;
`;
