import React from "react";
import { InputNumber, Input, Button } from "antd";
import { gql } from "@platform/data-access";
import { ExchangeFlow } from "@platform/ui-web";
import styled from "styled-components";
import { BiRightArrowAlt } from "react-icons/bi";
import { Utils } from "@shared/util";

type ExchangeItemProps = {
  //
  receipt: gql.Receipt;
};

export const ExchangeItem = ({ receipt }: ExchangeItemProps) => {
  const input = receipt.inputs[0];
  const output = receipt.outputs[0];
  return (
    <ExchangeItemContainer>
      <div className="line-1">
        <div className="label">
          <ExchangeFlow input={input} output={output} />
        </div>
        <div className="before">
          {input.value} {input.getName()}
        </div>
        {/* <BiRightArrowAlt /> */}
      </div>

      <div className="line-2">
        <div className="date">{Utils.toIsoString(receipt.updatedAt.toDate(), false)}</div>
        <div className="after">
          <BiRightArrowAlt />
          {output.value}
          {output.getName()}
        </div>
      </div>
    </ExchangeItemContainer>
  );
};

const ExchangeItemContainer = styled.div`
  padding: 12px 22px;
  border-bottom: 2px solid black; //grayD
  .line-1 {
    display: flex;
    justify-content: space-between;
    .label {
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 22px;
      line-height: 22px;
      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      svg {
        margin: 0 8px;
      }
    }
    .before {
      font-weight: 400;
      font-size: 22px;
      line-height: 22px;
    }
  }
  .line-2 {
    margin-top: 11px;
    display: flex;
    justify-content: space-between;

    color: black; //grayDD
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;

    .date {
    }
    .after {
      svg {
        margin-right: 6px;
        display: inline-block;
        alignment-baseline: middle;
      }
    }
  }
`;
