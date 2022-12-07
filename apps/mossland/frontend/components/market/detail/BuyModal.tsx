import React, { useEffect } from "react";
import styled from "styled-components";
import { DeliveryBuyBox, MarketReceipt, MarketDesc, SellBox, BuyBox, OnSaleBox } from ".";
import { Modal } from "./../../";
import { Market, ListingDetail } from "@platform/ui-web";
import { store } from "./../../../stores";

export const BuyModal = () => {
  const router = store.shared.ui.use.router();
  const listing = store.platform.listing.use.listing();
  const type = router.query.filter as "All" | "MossMarket" | "P2P" | "MyTokens";

  const getImage = () => {
    if (listing === "loading" || !listing) return "";
    if (listing.product) return listing.product.image.url;
    if (listing.token && listing.token.image) return listing.token.image.url;
    if (listing.thing) return listing.thing.image.url;
    return "";
  };
  const getName = () => {
    if (listing === "loading" || !listing) return "";
    if (listing.product) return listing.product.name;
    if (listing.token && listing.token.meta) return listing.token.meta.name;
    if (listing.thing) return listing.thing.name;
    return "";
  };

  if (!listing || listing === "loading") return null;
  return (
    <Modal title={getName()} type={"close"} onClose={() => store.platform.listing.do.resetListing()}>
      <ListingDetail.Body>
        <ListingDetail.Image src={getImage()} />
        <Desc>
          <div className="py-[24px] flex justify-between">
            {listing.status !== "soldout" ? (
              <>
                <div>
                  <div className="label">Price</div>
                  <div className="price">
                    <img src={listing.priceTags?.[0].thing?.image.url ?? ""} />
                    {listing.priceTags?.[0].price}
                  </div>
                </div>
                <div
                  // className={`buy-button ${service.checkIsBuyDisabled() && "disabled"}`}
                  className={`buy-button`}
                  onClick={async () => await service.onBuy()}
                >
                  Buy
                </div>
              </>
            ) : (
              <div className="soldout-text">Sold out!</div>
            )}
          </div>
        </Desc>
      </ListingDetail.Body>
    </Modal>
  );
};

const Desc = styled.div`
  z-index: 10;
  padding: 20px;
  flex: 1;
  position: relative;
  overflow: auto;
  height: 370px;
  .horaizontal {
    border-top: 2px solid #000;
  }
`;
