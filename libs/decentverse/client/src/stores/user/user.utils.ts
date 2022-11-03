import { types } from "..";

// export const getMyItems = (wallets: types.shared.Wallet[], thingItems: types.shared.ThingItem[]): types.MyItem[] => {
export const getMyItems = (user: types.User): types.MyItem[] => {
  if (!user.keyring) return [];
  const tokenItems: types.shared.TokenItem[] = user.keyring.wallets.reduce(
    (pre, cur) => [...pre, ...cur.items.filter((item) => item.type !== "root")],
    [] as types.shared.TokenItem[]
  );
  return [
    ...user.items
      .filter((item) => item.thing.type !== "root")
      .map((item): types.MyItem => ({ thing: item.thing, type: "thing", num: item.num })),
    ...tokenItems.map((item): types.MyItem => ({ token: item.token, type: "token", num: item.num })),
  ];
  // [tokenItems,thingItems].map((item):types.MyItem=>({thing:item.thing, token:item.token}));
};

export const getMyItemName = (item: types.MyItem) => {
  if (!item) return "";
  if (item.thing) return item.thing.name;
  if (item.token) return `${item.token.meta?.name ?? "unknown token"} #${item.token?.tokenId}`;
  else throw new Error("No Name");
};

export const getMyItemImage = (listing: types.MyItem) => {
  if (!listing) return "https://t1.daumcdn.net/cfile/tistory/225A6838583BD03E13";
  if (listing.token?.image?.url) return listing.token.image.url;
  if (listing.thing?.image?.url) return listing.thing.image.url;
  return "https://t1.daumcdn.net/cfile/tistory/225A6838583BD03E13";
};
