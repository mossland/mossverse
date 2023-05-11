import { AuthenticationError } from "apollo-server-core";
import * as jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Id } from "../dbConfig";
export type Account = {
  _id: Id; //유저의 아이디
  keyring: Id;
  role: "user" | "admin"; //
  roles: string[];
  status: "active" | "inactive";
};
export const verifyToken = (secret: string, authorization: string | undefined): Account | null => {
  const token = authorization && authorization.split(" ")[0] === "Bearer" && authorization.split(" ")[1];
  if (!token) return null;
  try {
    const account = jwt.verify(token, secret) as Account;
    if (!account || account.status === "inactive") return null;
    return { ...account, keyring: new Id(account.keyring), _id: new Id(account._id) };
  } catch (e) {
    return null;
  }
};

export const allow = (account: Account, roles: string[], userId?: Types.ObjectId) => {
  if (!account) throw new AuthenticationError("No Authentication");
  else if (roles.includes("every")) return true;
  else if (account.role === "user" && !roles.includes("user"))
    throw new AuthenticationError("No Authentication For User");
  else if (account.role === "admin" && !roles.includes("admin") && !roles.includes("superAdmin"))
    throw new AuthenticationError("No Authentication For Admin");
  else if (account.roles.every((role) => !roles.includes(role)))
    throw new AuthenticationError("No Authentication With Role");
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
