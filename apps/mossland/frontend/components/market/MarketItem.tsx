import React, { useEffect } from "react";
import styled from "styled-components";
import { gql, utils, store } from "../../stores";
import { ListingItem } from "@platform/ui-web";

type MarketItemProps = {
  item: gql.platform.Listing;
  onClick?: () => void;
};
export const MarketItem = ({ item, onClick }: MarketItemProps) => {
  return (
    <ListingItem onClick={onClick}>
      <ListingItem.Wrapper className="w-full rounded-t-md aspect-1 border-[1px] overflow-hidden flex justify-center items-center">
        <ListingItem.Image src={utils.platform.getListingImage(item) || ""} />
      </ListingItem.Wrapper>
      <ListingItem.Wrapper className="p-[5px] releative ">
        <ListingItem.Title>{utils.platform.getListingName(item)}</ListingItem.Title>
        <ListingItem.Price>
          {item.priceTags?.[0]?.thing && (
            <>
              <img className="w-5 h-5 mr-2" src={item.priceTags?.[0].thing?.image.url} />
              {item.priceTags?.[0].price}
            </>
          )}
          {item.priceTags?.[0]?.token && (
            <>
              <img className="w-5 h-5 mr-2" src={item.priceTags?.[0].token?.image?.url} />
              {item.priceTags?.[0].price}
            </>
          )}
        </ListingItem.Price>
      </ListingItem.Wrapper>
    </ListingItem>
  );
};
