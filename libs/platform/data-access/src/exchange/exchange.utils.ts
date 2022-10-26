import { types } from "@platform/data-access";

export const getExchangeName = (exchange: types.Exchange) => {
  return exchange.type === "thing"
    ? (exchange.thing as types.shared.Thing).name
    : exchange.type === "token"
    ? exchange?.token?.meta?.name ?? "unknown token"
    : exchange.type === "etc"
    ? "MOC"
    : "unknown";
};
