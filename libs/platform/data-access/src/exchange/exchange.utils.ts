import * as gql from "../gql";

export const getExchangeName = (exchange: gql.Exchange) => {
  return exchange.type === "thing"
    ? (exchange.thing as gql.shared.Thing).name
    : exchange.type === "token"
    ? exchange?.token?.meta?.name ?? "unknown token"
    : exchange.type === "etc"
    ? "MOC"
    : "unknown";
};
