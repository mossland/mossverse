import React from "react";
import { userStore } from "../../stores";
import styled from "styled-components";
import { Utils } from "@shared/util";

export const MyProfileBalance = () => {
  const self = userStore.use.self();
  const MMOC = self && self.items.find((item) => item.thing.name === "MMOC");
  const point = self && self.items.find((item) => item.thing.name === "Point");

  return (
    <MyProfileBalanceContainer>
      {MMOC ? (
        <div>
          <img src={MMOC.thing.image.url} />
          {MMOC.num ? Utils.numberWithCommas(MMOC.num) : 0}
        </div>
      ) : (
        <div>
          <img src="/images/mm_coin.png" />0
        </div>
      )}

      {point ? (
        <div>
          <img src={point.thing.image.url} />
          {point.num ? Utils.numberWithCommas(point.num) : 0}
        </div>
      ) : (
        <div>
          <img src="/platform/pt_coin.png" />0
        </div>
      )}
    </MyProfileBalanceContainer>
  );
};

const MyProfileBalanceContainer = styled.div`
  color: white;
  font-size: 26px;
  line-height: 1.1em;
  text-shadow: 0px 2px 0 #000;
  img {
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }
`;
