import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";
import { ListingItem } from "@platform/ui-web";
import { SellButton } from "./SellButton";

type MyItemProps = {
  item: gql.platform.MyItem;
  onClick?: () => void;
};
export const MyItem = ({ item, onClick }: MyItemProps) => {
  return (
    <ListingItem onClick={onClick}>
      <ListingItem.Wrapper className="w-full rounded-t-md aspect-1 border-[1px] overflow-hidden flex justify-center items-center">
        <ListingItem.Image src={utils.platform.getMyItemImage(item) || ""} />
      </ListingItem.Wrapper>
      <ListingItem.Info className="p-[5px] releative ">
        <ListingItem.Title>{utils.platform.getMyItemName(item)}</ListingItem.Title>
        <ListingItem.Desc>
          <div />
          <SellButton />
        </ListingItem.Desc>
      </ListingItem.Info>
    </ListingItem>
  );
};
