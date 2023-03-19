import { Locale } from "@shared/util-client";

export const mainLocale = {
  logout: ["Logout", "로그아웃"],
  footer1: ["This Admin System is Operated By Akamir", "이 어드민 시스템은 아카미르가 운영합니다"],
  footer2: [
    "Support Contact: bassman@akamir.com / +82)10-7445-3714",
    "지원 연락처:: bassman@akamir.com / +82)10-7445-3714",
  ],
  footer3: ["All Rights Reserved", "모든 권리는 아카미르에 있습니다"],
  profile: ["Profile", "프로필"],
  signIn: ["Sign In", "로그인"],
  signUp: ["Sign Up", "회원가입"],
  submit: ["Submit", "제출"],
  signUpFailed: ["Sign Up Failed", "회원가입 실패"],
  removeMsg: ["Are you sure to remove?", "정말로 삭제하시겠습니까?"],
  confirmMsg: ["Are you sure to {actionType}", "진행하시겠습니까? ({actionType})"],
  new: ["New", "신규"],
  selectNetwork: ["Select Network", "네트워크 선택"],
};

export type MainLocale = Locale<"main", unknown, typeof mainLocale>;
