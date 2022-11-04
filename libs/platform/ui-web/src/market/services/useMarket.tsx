import React, { ReactNode, useEffect } from "react";
import { store, gql, utils } from "../../index";
import { kaikas, metamask } from "@shared/util-client";
import { toast } from "react-toastify";

export const useMarket = () => {
  const self = store.platform.user.use.self();
  const myItems = store.platform.user.use.myItems();
  const myItem = store.platform.user.use.myItem();
  const filterMyItems = store.platform.user.use.filterMyItems();
  const initListing = store.platform.listing.use.initListing();
  const listing = store.platform.listing.use.listing();
  const receipt = store.platform.receipt.use.receipt();
  const filter = store.platform.listing.use.filter();
  const myTokensFilter = store.platform.listing.use.myTokensFilter();
  const listings = store.platform.listing.use.listingList();
  const operation = store.platform.listing.use.listingOperation();
  const resetListing = store.platform.listing.use.resetListing();
  const createListing = store.platform.listing.use.createListing();
  const cancelListing = store.platform.listing.use.cancel();
  const wallet = store.shared.wallet.use.wallet();
  const priceTags = store.platform.listing.use.priceTags();
  const priceTag = store.platform.listing.use.priceTag();
  const closeAt = store.platform.listing.use.closeAt();
  const sign = store.shared.keyring.use.sign();
  const market = store.platform.listing.use.marketAddr();
  const whoAmI = store.platform.user.use.whoAmI();
  const buyItem = store.platform.listing.use.buyItem();

  //* 리스트
  const onClickItem = (listing: gql.platform.Listing) => store.platform.listing.setState({ listing });
  const onClickMyItem = (myItem: gql.platform.MyItem) => store.platform.user.setState({ myItem });

  const getFilter = (listing: gql.platform.Listing) => {
    if (filter === "all") return self ? listing.user.id !== self.id : true;
    if (filter === "mossMarket") return self ? listing.user.id !== self.id && !listing.token : !listing.token;
    if (filter === "p2p")
      return self ? listing.user.id !== self.id && !listing.thing && !listing.product : !listing.product;
    if (filter === "myTokens") return self ? listing.user && listing.user.id === self.id : false;
    return false;
  };

  const isSelling = filter !== "myTokens" || (filter === "myTokens" && myTokensFilter === "onSale");
  const sellingCount = (isSelling && listings.filter((listing) => getFilter(listing)).length) || 0;

  //* 디테일
  const title =
    (listing && utils.platform.getListingName(listing)) ||
    (receipt && "success") ||
    (myItem && utils.platform.getMyItemName(myItem));
  const type = self
    ? listing && utils.platform.getListingType(listing, self)
    : listing && utils.platform.getListingType(listing);
  const image =
    (listing && utils.platform.getListingImage(listing)) ||
    (receipt?.listing && utils.platform.getListingImage(receipt.listing)) ||
    (myItem && utils.platform.getMyItemImage(myItem));
  const desc = (listing && utils.platform.getListingDesc(listing)) || (myItem && utils.platform.getMyItemDesc(myItem));
  const onSell = async () => {
    try {
      if (!wallet || !myItem || !priceTag?.price || !closeAt) return;

      store.platform.listing.setState({ ...myItem, user: self, wallet, limit: 1 });
      await sign(wallet.network.provider);
      if (myItem.token && market) await kaikas.setApprvalForAll(myItem.token.contract.address, wallet.address, market);
      store.platform.listing.setState({ priceTags: [...priceTags, priceTag] });
      await createListing();
      store.platform.user.setState({ myItem: null });
      await whoAmI();
      await initListing({ status: "active" });
      onClose();
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  const onClose = () => {
    store.platform.shipInfo.setState({ ...gql.platform.defaultShipInfo });
    store.platform.listing.setState({ listing: null });
    store.platform.receipt.setState({ receipt: null });
    resetListing();
    store.platform.user.setState({ myItem: null });
  };

  const onCancel = async () => {
    if (!wallet || !listing) return;
    await sign(wallet.network.provider);

    await cancelListing();
    await whoAmI();
    await initListing();
    onClose();
  };

  const checkIsHide = () => !listing && !receipt && !myItem;
  const checkIsBuy = () => listing && (type === "p2p" || type === "default");
  const checkIsDeliveryBuy = () => listing && type === "delivery";
  const checkIsOnSale = () => listing && type === "myTokens";
  const checkIsSell = () => !!myItem;
  const checkIsReceipt = () => !!receipt;

  // BoyBox
  const buyable = listing && utils.platform.isBuyable(listing, self);
  const checkIsBuyDisabled = () => !self || !listing || !wallet || !buyable;
  const onBuy = async () => {
    if (!self || !listing || !wallet! || !buyable) return;
    store.platform.listing.setState({ priceTag: listing.priceTags[0], num: 1 });
    await sign(wallet.network.provider);
    const receipt = await buyItem();
    await whoAmI();
    await initListing({ status: "active" });
    store.platform.listing.setState({ listing: null });
    store.platform.receipt.setState({ receipt });
  };

  // DeliveryBuyBox
  const num = store.platform.listing.use.num();
  const name = store.platform.shipInfo.use.name();
  const phone = store.platform.shipInfo.use.phone();
  const address = store.platform.shipInfo.use.address();
  const updateNum = (num: number) => store.platform.listing.setState({ num });
  const updateName = (name: string) => store.platform.shipInfo.setState({ name });
  const updatePhone = (phone: string) => store.platform.shipInfo.setState({ phone });
  const updateAddress = (address: string) => store.platform.shipInfo.setState({ address });
  const purifyShipInfo = store.platform.shipInfo.use.purify();
  const shipInfo = store.platform.shipInfo.use.shipInfo();
  const initUser = store.platform.user.use.initUser();
  const onDeliveryBuy = async () => {
    if (!wallet) return alert("로그인 후  다시 시도해주세요.");
    if (!listing) return;
    store.platform.listing.setState({ priceTag: listing.priceTags[0], num: 1 });
    await sign(wallet.network.provider);
    const shipInfoInput = purifyShipInfo();
    if (!shipInfoInput) return;
    const receipt = await buyItem(shipInfoInput);
    await initUser();
    await initListing();
    store.platform.listing.setState({ listing: null });
    store.platform.receipt.setState({ receipt });
  };

  // SellBox

  return {
    self,
    myItems,
    filterMyItems,
    initListing,
    filter,
    myTokensFilter,
    listings,
    operation,
    onClickItem,
    onClickMyItem,
    getFilter,
    isSelling,
    sellingCount,
    listing,
    receipt,
    myItem,
    title,
    type,
    image,
    desc,
    onSell,
    onClose,
    onCancel,
    checkIsHide,
    checkIsBuy,
    checkIsDeliveryBuy,
    checkIsOnSale,
    checkIsSell,
    checkIsReceipt,
    buyable,
    onBuy,
    checkIsBuyDisabled,
    num,
    name,
    phone,
    address,
    updateNum,
    updateName,
    updatePhone,
    updateAddress,
    shipInfo,
    onDeliveryBuy,
    closeAt,
    priceTag,
  };
};
