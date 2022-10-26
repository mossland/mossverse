import { listingStore, userStore, receiptStore, shipInfoStore, types, utils } from "@platform/data-access";
import { keyringStore, walletStore } from "@shared/data-access";
import { kaikas, metamask } from "@shared/util-client";
import React from "react";
import styled from "styled-components";
import { DeliveryBuyBox, MarketReceipt, MarketDesc, SellBox, BuyBox, OnSaleBox } from ".";
import { Modal } from "./../../";
import { toast } from "react-toastify";

export const DetailModal = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const myItem = userStore.use.myItem();
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
  if (!listing && !receipt && !myItem) return <></>;

  const title =
    (listing && utils.getListingName(listing)) || (receipt && "success") || (myItem && utils.getMyItemName(myItem));
  const type = self ? listing && utils.getListingType(listing, self) : listing && utils.getListingType(listing);
  const image =
    (listing && utils.getListingImage(listing)) ||
    (receipt && utils.getListingImage(receipt.listing)) ||
    (myItem && utils.getMyItemImage(myItem));
  const desc = (listing && utils.getListingDesc(listing)) || (myItem && utils.getMyItemDesc(myItem));
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
      onClose();
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  const onClose = () => {
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
    onClose();
  };

  return (
    <Modal title={title ?? ""} type={"close"} onClose={onClose}>
      <DetailBody>
        {image ? <ProductImage src={image} className="product-image" /> : <div className="empty-image">no image</div>}
        <Desc>
          {/* 일반상품, p2p */}
          {listing && (type === "p2p" || type === "default") && <BuyBox />}
          {/* 배송상품 */}
          {listing && type === "delivery" && <DeliveryBuyBox />}
          {/* 팔고있는 상품  */}
          {listing && type === "myTokens" && <OnSaleBox listing={listing} onCancel={onCancel} />}
          {/* 팔 수 있는 상품 */}
          {myItem && <SellBox myItem={myItem} onClickSell={onSell} />}
          <div className="horaizontal" />
          {<MarketDesc desc={desc} />}
          {/* 영수증 */}
          {receipt && <MarketReceipt receipt={receipt} />}
        </Desc>
      </DetailBody>
    </Modal>
  );
};

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 0.9;
`;

const DetailBody = styled.div`
  display: flex;
  flex-direction: row;
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
`;
const ProductImage = styled.img`
  width: 324px;
  height: 324px;
  /* align-self: center; */
  justify-content: center;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
`;
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
