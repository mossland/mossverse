import { User } from "./user.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const userLocale = {
  ...baseLocale,
  nickname: ["Nickname", "닉네임"],
  image: ["Image", "이미지"],
  roles: ["Roles", "권한"],
  keyring: ["Keyring", "Keyring"],
  requestRoles: ["Request Roles", "권한 요청"],
} as const;

export type UserLocale = Locale<"user", User, typeof userLocale>;
