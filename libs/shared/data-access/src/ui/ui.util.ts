import { cnst } from "@shared/util";

export const getRequiredAuth = (pageMap: cnst.PageMap, pathname: string): "user" | "admin" | "public" =>
  Object.keys(pageMap).find((key) => pageMap[key].paths.some((path) => pathname.startsWith(path))) ?? ("public" as any);
