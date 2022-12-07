import styled, { CSSProp } from "styled-components";
import { Text, Title, RangePicker, TextArea, Button, Wrapper, TextInput } from "@shared/ui-web";

export const StyledItemContainer = styled.div`
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0px 0px 8px 0px #00000033;
  /* width: 20%; */
  margin-top: 5px;
`;

export const StyledItemImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-width: 1px;
  /* background-color: red; */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    margin-right: 2px;
    height: 100%;
    border-radius: 6px 6px 0 0;
  }
`;

export const StyledItemInfo = styled.div`
  padding: 5px;
  color: #282828;
  position: relative;
  border-radius: 0 0 6px 6px;
  &.selling {
    background-color: #ffd749;
  }
`;

export const StyledItemInfoTitle = styled(Title)`
  font-size: 12px;
  margin-left: 10px;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const StyledItemInfoDesc = styled(Text)`
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
  align-items: center;
`;

export const StyledItemInfoPrice = styled.div`
  font-size: 14px;
  font-weight: bold;

  img {
    width: 12px;
    margin-right: 6px;
  }
`;
