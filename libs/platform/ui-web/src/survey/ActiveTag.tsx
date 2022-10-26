import styled from "styled-components";

export const ActiveTag = () => <StyledActiveTag>Active</StyledActiveTag>;

const StyledActiveTag = styled.div`
  font-size: 12px;
  text-align: center;
  line-height: 12px;
  /* border: 1px solid #000; */
  background-color: #ffe177;
  padding: 3px 6px;
  margin-right: 6px;
  border-radius: 4px;
`;
