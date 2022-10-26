import { listingStore, receiptStore, shipInfoStore, types, userStore, utils } from "@platform/data-access";
import { keyringStore, walletStore } from "@shared/data-access";
import { kaikas, metamask } from "@shared/util-client";
import { WindowHeader } from "@shared/ui-web";
import React from "react";
import styled from "styled-components";
import { BuyBox, SellBox, DeliveryBuyBox, MarketDetailHeader, MarketDesc, OnSaleBox, MarketReceipt } from ".";
import { toast } from "react-toastify";

export const DetailMobileModal = () => {
  const self = userStore.use.self();
  const myItem = userStore.use.myItem();
  const wallet = walletStore.use.wallet();
  const listing = listingStore.use.listing();
  const receipt = receiptStore.use.receipt();
  const market = listingStore.use.marketAddr();
  const priceTag = listingStore.use.priceTag();
  const closeAt = listingStore.use.closeAt();

  const initUser = userStore.use.init();
  const sign = keyringStore.use.sign();
  const initListing = listingStore.use.init();
  const resetListing = listingStore.use.reset();
  const createListing = listingStore.use.create();
  const cancelListing = listingStore.use.cancel();

  const title =
    (listing && utils.getListingName(listing)) || (receipt && "success") || (myItem && utils.getMyItemName(myItem));
  const type = self ? listing && utils.getListingType(listing, self) : listing && utils.getListingType(listing);
  const image =
    (listing && utils.getListingImage(listing)) ||
    (receipt && utils.getListingImage(receipt.listing)) ||
    (myItem && utils.getMyItemImage(myItem));
  const desc = (listing && utils.getListingDesc(listing)) || (myItem && utils.getMyItemImage(myItem));

  const onSell = async () => {
    try {
      if (!wallet || !myItem || !priceTag?.price || !closeAt) return;

      listingStore.setState({ ...myItem, user: self, wallet, limit: 1 });
      await sign(wallet.network.provider);
      if (myItem.token && market) await kaikas.setApprvalForAll(myItem.token.contract.address, wallet.address, market);
      await createListing();
      userStore.setState({ myItem: null });
      await initUser();
      await initListing();
      onBack();
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  const onBack = () => {
    shipInfoStore.setState({ ...types.defaultShipInfo });
    listingStore.setState({ listing: null });
    receiptStore.setState({ receipt: null });
    resetListing();
    userStore.setState({ myItem: null });
  };

  const onCancel = async () => {
    if (!wallet || !listing) return;
    await sign(wallet.network.provider);

    await cancelListing();
    // listing.setState({ myItem: null });
    await initUser();
    await initListing();
    onBack();
  };

  if (!listing && !receipt && !myItem) return <></>;

  return (
    <DetailMobileModalContainer>
      <MarketDetailHeader title={title ?? ""} type={""} onClick={onBack} />
      <div className="body">
        {image ? <img src={image} className="product-image" /> : <div className="empty-image">no image</div>}
        {/* 일반상품, p2p */}
        {(type === "p2p" || type === "default") && <BuyBox />}
        {/* 팔고있는 상품  */}
        {listing && type === "myTokens" && <OnSaleBox listing={listing} onCancel={onCancel} />}
        {/* 배송상품 */}
        {type === "delivery" && <DeliveryBuyBox />}
        {/* 내 상품  */}
        {/* 팔 수 있는 상품 */}
        {myItem && <SellBox myItem={myItem} onClickSell={onSell} />}

        {receipt && <MarketReceipt receipt={receipt} />}
        <div className="horaizontal" />
        {<MarketDesc desc={desc} />}
      </div>
    </DetailMobileModalContainer>
  );
};

const DetailMobileModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  background: #ffffff;
  .body {
    padding: 23px;
    .product-image {
      width: 100%;
      border-radius: 10px;
    }
    .empty-image {
      width: 324px;
      height: 324px;
      /* align-self: center; */
      justify-content: center;
      margin: 10px;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .horaizontal {
      border-top: 2px solid #000;
    }
  }
`;
