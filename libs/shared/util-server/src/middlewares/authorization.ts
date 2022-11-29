import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Id } from "../dbConfig";
export type Account = {
  _id: Id;
  keyring: Id;
  role: "user" | "admin" | "superAdmin";
  status: "active" | "inactive";
};
export const verifyToken = (secret: string, authorization: string | undefined): Account | null => {
  const token = authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1];
  if (!token) return null;
  const account = jwt.verify(token, secret) as Account;
  if (!account || account.status === "inactive") return null;
  return { ...account, keyring: new Id(account.keyring), _id: new Id(account._id) };
};

export const allow = (account: Account, roles: string[], userId?: Types.ObjectId) => {
  if (!account || !(roles.includes(account.role) || roles.includes("every"))) throw new Error("Authentication Failed");
  else if (userId && account.role === "user" && !account._id.equals(userId)) throw new Error("Invalid User");
  return true;
};

export const allowExcept = (account: Account, roles: string[], userId?: string | Types.ObjectId) => {
  if (!account || roles.includes(account.role)) throw new Error("Authentication Failed");
  else if (userId && account.role === "user" && !account._id.equals(userId)) throw new Error("Invalid User");
  return true;
};

export const handleUnauthorized = () => {
  throw new Error("Authentication Failed");
};
