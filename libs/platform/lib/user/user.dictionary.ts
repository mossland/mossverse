import { Translate, baseTrans } from "@util/client";
import { User } from "./user.fetch";

export const userTrans = {
  ...baseTrans,
  nickname: ["Nickname", "닉네임"],
  image: ["Image", "이미지"],
  roles: ["Roles", "역할"],
  keyring: ["Keyring", "키링"],
  requestRoles: ["Request Roles", "권한 요청"],
} satisfies Translate<User>;
