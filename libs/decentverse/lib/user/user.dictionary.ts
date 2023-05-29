import { Translate, baseTrans } from "@util/client";
import { User } from "./user.fetch";

export const userTrans = {
  ...baseTrans,
  currentPosition: ["Current Position", "현재 위치"],
  currentMap: ["Current Map", "현재 맵"],
  roles: ["Roles", "역할"],
  keyring: ["Keyring", "키링"],
  nickname: ["Nickname", "닉네임"],
  image: ["Image", "이미지"],
  requestRoles: ["Request Roles", "권한 요청"],
} satisfies Translate<User>;
