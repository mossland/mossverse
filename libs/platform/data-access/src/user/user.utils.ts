import * as gql from "../gql";

// export const getMyItems = (wallets: gql.shared.Wallet[], thingItems: gql.shared.ThingItem[]): gql.MyItem[] => {
export const getMyItems = (user: gql.User): gql.MyItem[] => {
  if (!user.keyring) return [];
  // let tokenItems: gql.shared.TokenItem[] = [];
  // user.keyring.wallets.reduce((pre: gql.shared.Wallet, cur: gql.shared.Wallet, idx: number) => {
  //   tokenItems = [...tokenItems, ...cur.items.filter((item) => item.type !== "root")];
  //   return cur;
  // });

  //! 새로 만들어야함. 더이상 User에서 Keyring resolve를 지원하지 않음
  return [];
  // user.keyring.wallets.map((wallet: gql.shared.Wallet, idx: number) => {
  //   tokenItems = [
  //     ...tokenItems,
  //     ...wallet.items,
  //     // .filter((item) => item.type !== "root")
  //   ];
  // });
  // return [
  //   ...tokenItems.map((item): gql.MyItem => ({ token: item.token, type: "token", num: item.num })),
  //   ...user.items
  //     .filter((item) => item.thing.type !== "root")
  //     .map((item): gql.MyItem => ({ thing: item.thing, type: "thing", num: item.num })),
  // ];
  // [tokenItems,thingItems].map((item):gql.MyItem=>({thing:item.thing, token:item.token}));
};

export const getMyItemName = (item: gql.MyItem): string => {
  if (!item) return "aa";
  if (item.thing) return item.thing.name;
  if (item.token) return `${item.token.meta?.name ?? "unknown token"} #${item.token?.tokenId}`;
  return "";
};

export const getMyItemImage = (listing: gql.MyItem): string => {
  if (listing.token?.image?.url) return listing.token.image.url;
  if (listing.thing?.image?.url) return listing.thing.image.url;
  return "";
};
export const getMyItemDesc = (listing: gql.MyItem): string => {
  if (listing.token && listing.token.meta) return listing.token.meta?.description;
  if (listing.thing) return listing.thing.description;
  return "";
};
