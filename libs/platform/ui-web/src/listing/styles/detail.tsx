import styled from "styled-components";

export const StyledDetailBody = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledProductImage = styled.div`
  img,
  .empty-image {
    width: 324px;
    height: 324px;
    justify-content: center;
    margin: 10px;
    border-radius: 10px;
    overflow: hidden;
  }
  .empty-image {
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    img,
    .empty-image {
      width: 100%;
      height: auto;
      margin: 0px;
    }
    .empty-image {
      height: 324px;
    }
  }
`;
