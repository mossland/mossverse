import { Translate, baseTrans } from "@util/client";
import { User, UserSummary } from "./user.fetch";

export const userTrans = {
  ...baseTrans,
  hotkeys: ["Hotkeys", "핫키"],
  currentPosition: ["Current Position", "현재 위치"],
  currentMap: ["Current Map", "현재 맵"],
  roles: ["Roles", "역할"],
  keyring: ["Keyring", "Keyring"],
  image: ["Image", "이미지"],
  nickname: ["Nickname", "닉네임"],
  requestRoles: ["Request Roles", "역할 요청"],
  totalUser: ["Total User", "총 사용자 수"],
} satisfies Translate<User & UserSummary>;
