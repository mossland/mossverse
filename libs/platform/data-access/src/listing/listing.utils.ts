import * as gql from "../gql";
export const getListingName = (item: gql.Listing) => {
  if (!item) return "";
  // if (item.product) return item.product.name;
  if (item.thing) return item.thing.name;
  if (item.token) return `${item.token.meta?.name ?? "unknown token"} #${item.token?.tokenId}`;
  return "";
};

export const getListingType = (item: gql.Listing, self?: gql.User) => {
  if (self && item.user.id === self.id) return "myTokens";
  if (!item) return "default";
  if (!item.token) return item.product ? "delivery" : "default";
  if (!item.thing) return "p2p";
  return "default";
};

export const getListingImage = (listing: gql.Listing) => {
  if (listing.token?.image?.url) return listing.token.image.url;
  // if (listing.thing?.image?.url) return listing.thing.image.url;
  // if (listing.product?.image?.url) return listing.product.image.url;
  return null;
};

export const getListingDesc = (listing: gql.Listing) => {
  if (listing.token && listing.token.meta) return listing.token.meta.description;
  // if (listing.thing) return listing.thing.description;
  // if (listing.product) return listing.product.description;
  return null;
};

export const isBuyable = (listing: gql.Listing, self: gql.User | null) => {
  if (!self) return false;
  return self.items.some(
    (item) =>
      listing.priceTags[0].thing &&
      listing.priceTags[0].thing.id === item.thing.id &&
      listing.priceTags[0].price <= item.num
  );
};
