import { types } from "..";

// export const getMyItems = (wallets: types.shared.Wallet[], thingItems: types.shared.ThingItem[]): types.MyItem[] => {
export const getMyItems = (user: types.User): types.MyItem[] => {
  if (!user.keyring) return [];
  let tokenItems: types.shared.TokenItem[] = [];
  // user.keyring.wallets.reduce((pre: types.shared.Wallet, cur: types.shared.Wallet, idx: number) => {
  //   tokenItems = [...tokenItems, ...cur.items.filter((item) => item.type !== "root")];
  //   return cur;
  // });
  user.keyring.wallets.map((wallet: types.shared.Wallet, idx: number) => {
    tokenItems = [...tokenItems, ...wallet.items.filter((item) => item.type !== "root")];
  });
  return [
    ...tokenItems.map((item): types.MyItem => ({ token: item.token, type: "token", num: item.num })),
    ...user.items
      .filter((item) => item.thing.type !== "root")
      .map((item): types.MyItem => ({ thing: item.thing, type: "thing", num: item.num })),
  ];
  // [tokenItems,thingItems].map((item):types.MyItem=>({thing:item.thing, token:item.token}));
};

export const getMyItemName = (item: types.MyItem): string => {
  if (!item) return "aa";
  if (item.thing) return item.thing.name;
  if (item.token) return `${item.token.meta?.name ?? "unknown token"} #${item.token?.tokenId}`;
  return "";
};

export const getMyItemImage = (listing: types.MyItem): string => {
  if (listing.token?.image?.url) return listing.token.image.url;
  if (listing.thing?.image?.url) return listing.thing.image.url;
  return "";
};
export const getMyItemDesc = (listing: types.MyItem): string => {
  if (listing.token && listing.token.meta) return listing.token.meta?.description;
  if (listing.thing) return listing.thing.description;
  return "";
};
