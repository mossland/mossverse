import * as gql from "../gql";

// export const getMyItems = (wallets: gql.shared.Wallet[], thingItems: gql.shared.ThingItem[]): gql.MyItem[] => {
export const getMyItems = (user: gql.User): gql.MyItem[] => {
  if (!user.keyring) return [];
  const tokenItems: gql.shared.TokenItem[] = user.keyring.wallets.reduce(
    (pre, cur) => [...pre, ...cur.items],
    [] as gql.shared.TokenItem[]
  );
  return [
    ...user.items
      .filter((item) => item.thing.type !== "root")
      .map((item): gql.MyItem => ({ thing: item.thing, type: "thing", token: null, user, num: item.num })),
    ...tokenItems.map((item): gql.MyItem => ({ token: item.token, type: "token", thing: null, user, num: item.num })),
  ];
  // [tokenItems,thingItems].map((item):gql.MyItem=>({thing:item.thing, token:item.token}));
};

export const getMyItemName = (item: gql.MyItem) => {
  if (!item) return "";
  if (item.thing) return item.thing.name;
  if (item.token) return `${item.token.meta?.name ?? "unknown token"} #${item.token?.tokenId}`;
  else throw new Error("No Name");
};

export const getMyItemImage = (listing: gql.MyItem) => {
  if (!listing) return "";
  if (listing.token?.image?.url) return listing.token.image.url;
  if (listing.thing?.image?.url) return listing.thing.image.url;
  return "";
};
