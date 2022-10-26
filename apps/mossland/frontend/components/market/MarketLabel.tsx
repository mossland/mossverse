import React, { useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { types } from "@platform/data-access";

type MarketLabelProps = {
  item: types.Listing;
};
export const MarketLabel = ({ item }: MarketLabelProps) => {
  return (
    <MarketLabelContainer>
      {item.user && item.token && <div className="label label--p2p">P2P</div>}
      {item.user && item.thing && <div className="label label--delivery">Thing</div>}
      {item.user && item.product && <div className="label label--delivery">Delivery</div>}
    </MarketLabelContainer>
  );
};

const MarketLabelContainer = styled.div`
  .label {
    position: absolute;
    top: -28px;
    left: -2px;

    font-size: 10px;
    font-weight: bold;
    color: white;
    height: 16px;
    padding-left: 3px;
  }
  .label--p2p {
    background-image: url("/images/market/label_p2p.png");
    background-size: 29px;
    width: 29px;
  }
  .label--delivery {
    background-image: url("/images/market/label_delivery.png");
    background-size: 54px;
    width: 54px;
  }
`;
