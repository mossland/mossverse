import React, { useEffect } from "react";
import styled from "styled-components";
import { Divider, Tag } from "antd";

type TagProps = {
  text: string;
  color: string;
};

export const CustomTag = ({ text, color }: TagProps) => {
  return <Container color={color}>{text}</Container>;
};

const Container = styled(Tag)`
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 50px; */
  height: 18px;

  border-radius: 4px;
  font-family: Ubuntu Mono;
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  line-height: 12px;
  color: #fff;
`;
