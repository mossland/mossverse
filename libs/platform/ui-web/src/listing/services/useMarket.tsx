import React, { ReactNode, useEffect } from "react";
import { store, gql, utils } from "@platform/data-access";
import { kaikas, metamask } from "@shared/util-client";
import { toast } from "react-toastify";

export const useMarket = () => {
  const self = store.user.use.self();
  const myItems = store.user.use.myItems();
  const myItem = store.user.use.myItem();
  const filterMyItems = store.user.use.filterMyItems();
  const initListing = store.listing.use.initListing();
  const listing: any = store.listing.use.listing();
  const receipt = store.receipt.use.receipt();
  const filter = store.listing.use.filter();
  const myTokensFilter = store.listing.use.myTokensFilter();
  const listings = store.listing.use.listingList();
  const operation = store.listing.use.listingOperation();
  const resetListing = store.listing.use.resetListing();
  const createListing = store.listing.use.createListing();
  const cancelListing = store.listing.use.cancel();
  const wallet = store.shared.wallet.use.wallet();
  const priceTag = store.listing.use.priceTag();
  const listingForm = store.listing.use.listingForm();
  const sign = store.shared.keyring.use.sign();
  const market = store.listing.use.marketAddr();
  const whoAmI = store.user.use.whoAmI();
  const buyItem = store.listing.use.buyItem();

  //* 리스트
  const onClickItem = (listing: gql.Listing) => store.listing.setState({ listing });
  const onClickMyItem = (myItem: gql.MyItem) => store.user.setState({ myItem });

  const getFilter = (listing: gql.Listing) => {
    if (filter === "all") return self ? listing.user.id !== self.id : true;
    if (filter === "mossMarket") return self ? listing.user.id !== self.id && !listing.token : !listing.token;
    if (filter === "p2p")
      return self ? listing.user.id !== self.id && !listing.thing && !listing.product : !listing.product;
    if (filter === "myTokens") return self ? listing.user && listing.user.id === self.id : false;
    return false as any;
  };

  const isSelling = filter !== "myTokens" || (filter === "myTokens" && myTokensFilter === "onSale");
  const sellingCount = (isSelling && (listings as any).filter((listing) => getFilter(listing)).length) || 0;

  //* 디테일
  const title =
    (listing && utils.getListingName(listing)) || (receipt && "success") || (myItem && utils.getMyItemName(myItem));
  const type = self ? listing && utils.getListingType(listing, self) : listing && utils.getListingType(listing);
  const image =
    (listing && utils.getListingImage(listing)) ||
    (receipt !== "loading" && receipt?.listing && utils.getListingImage(receipt.listing)) ||
    (myItem && utils.getMyItemImage(myItem));
  const desc = (listing && utils.getListingDesc(listing)) || (myItem && utils.getMyItemDesc(myItem));
  const onSell = async () => {
    try {
      if (!wallet || !myItem || !priceTag?.price || !listingForm.closeAt) return;

      store.listing.setState({
        listingForm: { ...listingForm, user: self, wallet: wallet as any, limit: 1, ...myItem },
      });
      await sign((wallet as any).network.provider);
      if (myItem.token && market)
        await kaikas.setApprvalForAll(myItem.token.contract.address, (wallet as any).address, market);
      store.listing.setState({
        listingForm: { ...listingForm, priceTags: [...listingForm.priceTags, priceTag] },
      });
      await createListing();
      store.user.setState({ myItem: null });
      await whoAmI();
      await initListing({ query: { status: "active" } });
      onClose();
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };

  const onClose = () => {
    store.shipInfo.setState({ ...gql.defaultShipInfo });
    store.listing.do.resetListing();
    store.receipt.do.resetReceipt();
    resetListing();
    store.user.setState({ myItem: null });
  };

  const onCancel = async () => {
    if (!wallet || !listing) return;
    await sign((wallet as any).network.provider);

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
  const buyable = listing && utils.isBuyable(listing as any, self);
  const checkIsBuyDisabled = () => !self || !listing || !wallet || !buyable;
  const onBuy = async () => {
    if (!self || !listing || !wallet! || !buyable) return;
    store.listing.setState({ priceTag: (listing as any).priceTags[0], num: 1 });
    await sign((wallet as any).network.provider);
    const receipt: any = await buyItem();
    await whoAmI();
    await initListing({ query: { status: "active" } });
    store.listing.do.resetListing();
    store.receipt.setState({ receipt });
  };

  // DeliveryBuyBox
  const num = store.listing.use.num();
  const name = store.shipInfo.use.name();
  const phone = store.shipInfo.use.phone();
  const address = store.shipInfo.use.address();
  const updateNum = (num: number) => store.listing.setState({ num });
  const updateName = (name: string) => store.shipInfo.setState({ name });
  const updatePhone = (phone: string) => store.shipInfo.setState({ phone });
  const updateAddress = (address: string) => store.shipInfo.setState({ address });
  const purifyShipInfo = store.shipInfo.use.purify();
  const shipInfo = store.shipInfo.use.shipInfo();
  const initUser = store.user.use.initUser();
  const onDeliveryBuy = async () => {
    if (!wallet) return alert("로그인 후  다시 시도해주세요.");
    if (!listing) return;
    store.listing.setState({ priceTag: (listing as any).priceTags[0], num: 1 });
    await sign((wallet as any).network.provider);
    const shipInfoInput = purifyShipInfo();
    if (!shipInfoInput) return;
    const receipt: any = await buyItem(shipInfoInput);
    await initUser();
    await initListing();
    store.listing.do.resetListing();
    store.receipt.setState({ receipt });
  };

  // SellBox

  return {
    self,
    myItems,
    // filter,
    // myTokensFilter,
    listings,
    operation,
    // isSelling,
    // sellingCount,
    listing,
    receipt,
    myItem,
    title,
    type,
    image,
    desc,
    buyable,
    num,
    name,
    phone,
    address,
    shipInfo,
    priceTag,
    onBuy,
    onSell,
    onClose,
    onCancel,
    getFilter,
    updateNum,
    updateName,
    updatePhone,
    initListing,
    updateAddress,
    onDeliveryBuy,
    checkIsHide,
    checkIsBuy,
    checkIsDeliveryBuy,
    checkIsOnSale,
    checkIsSell,
    checkIsReceipt,
    filterMyItems,
    onClickItem,
    onClickMyItem,
    closeAt: listingForm.closeAt,
  };
};
