import { Keyring, KeyringSummary } from "./keyring.gql";
import { baseLocale, Locale } from "@shared/util-client";

export const keyringLocale = {
  ...baseLocale,
  name: ["Name", "이름"],
  user: ["User", "유저"],
  wallets: ["Wallets", "지갑"],
  holds: ["Holds", "Holds"],
  discord: ["Discord", "디스코드"],
  accountId: ["AccountId", "어카운트아이디"],
  phone: ["Phone", "휴대폰"],
  phoneCodeAts: ["PhoneCodeAts", "PhoneCodeAts"],
  verifies: ["Verifies", "Verifies"],
  isOnline: ["IsOnline", "온라인"],
  lastLoginAt: ["LastLoginAt", "마지막로그인일시"],
  totalKeyring: ["Total Keyring", "총 키링수"],
  prevPassword: ["Password", "기존 비밀번호"],
  newPassword: ["New Password", "새 비밀번호"],
  passwordConfirm: ["Confirm Password", "비밀번호 확인"],
  changePassword: ["Change Password", "비밀번호 변경"],
} as const;

export type KeyringLocale = Locale<"keyring", Keyring & KeyringSummary, typeof keyringLocale>;
