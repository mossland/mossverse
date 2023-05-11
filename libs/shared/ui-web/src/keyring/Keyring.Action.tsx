import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Apple, Editor, Facebook, Field, Github, Google, Kakao, Naver, Input } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@shared/data-access";
import { Modal } from "antd";
import { LoginForm, useInterval } from "@shared/util-client";
import { ReactNode, useState } from "react";
import { cnst, Utils } from "@shared/util";
import dayjs from "dayjs";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface VerifyPhoneProps {
  disabled: boolean;
  hash?: string;
}
export const VerifyPhone = ({ disabled, hash = "verify" }: VerifyPhoneProps) => {
  const myKeyring = st.use.myKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({ minute: 0, second: 0 });
  const keyringForm = st.use.keyringForm();
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({ minute: Math.floor(remainSec / 60), second: remainSec % 60 });
  }, 1000);
  return (
    <>
      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-36">전화번호</div>
        <div className="flex w-full rounded-r-none">
          <Input className="rounded-r-none" value={myKeyring.phone ?? ""} disabled={true} />
          <button
            className={`btn rounded-l-none w-24 ${!phoneCodeAt && "btn-primary"}`}
            disabled={disabled || !Utils.isPhoneNumber(keyringForm.phone) || myKeyring.isPhoneVerified()}
            onClick={async () => myKeyring.phone && st.do.requestPhoneCode(myKeyring.id, myKeyring.phone, hash)}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>

      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-36">인증번호</div>
        <div className="relative flex w-full rounded-r-none">
          <Input
            className="rounded-r-none"
            value={phoneCode}
            onChange={(e) => st.do.setPhoneCode(Utils.formatPhone(e.target.value))}
            disabled={!phoneCodeAt || myKeyring.isPhoneVerified()}
          />
          {!myKeyring.isPhoneVerified() && phoneCodeAt && (
            <div className="absolute flex items-center h-8 text-sm align-middle text-color-main-light right-24">
              {Utils.pad(phoneCodeRemain.minute, 2)}:{Utils.pad(phoneCodeRemain.second, 2)}
            </div>
          )}
          <button
            className="w-24 rounded-l-none btn btn-primary"
            disabled={!phoneCodeAt || myKeyring.isPhoneVerified()}
            onClick={async () => st.do.verifyPhoneCode()}
          >
            {myKeyring.isPhoneVerified() ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </>
  );
};

interface SignupPhoneProps {
  disabled: boolean;
  hash?: string;
  loginForm?: Partial<LoginForm>;
}
export const SignupPhone = ({ disabled, hash = "signup", loginForm }: SignupPhoneProps) => {
  const signupKeyring = st.use.signupKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({ minute: 0, second: 0 });
  const keyringForm = st.use.keyringForm();
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({ minute: Math.floor(remainSec / 60), second: remainSec % 60 });
  }, 1000);
  return (
    <>
      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-28">전화번호</div>
        <div className="flex w-full input-group">
          <Input
            className="w-36"
            value={keyringForm.phone ?? ""}
            onChange={(e) => st.do.setPhoneOnKeyring(Utils.formatPhone(e.target.value))}
            disabled={signupKeyring?.verifies.includes("phone")}
          />
          <button
            className={`w-20 btn ${!phoneCodeAt && "btn-primary"} text-xs`}
            disabled={disabled || !Utils.isPhoneNumber(keyringForm.phone) || signupKeyring?.verifies.includes("phone")}
            onClick={async () => {
              if (!keyringForm.phone) return;
              const keyringIdHasPhone = await gql.getKeyringIdHasPhone(keyringForm.phone);
              if (keyringIdHasPhone) return window.alert("이미 사용중인 전화번호입니다.");
              const keyring = await gql.addPhoneInPrepareKeyring(keyringForm.phone, signupKeyring?.id ?? null);
              st.do.requestPhoneCode(keyring.id, keyringForm.phone);
              st.set({ signupKeyring: keyring });
            }}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>

      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-28">인증번호</div>
        <div className="relative flex w-full rounded-r-none input-group">
          <Input
            className="w-36"
            value={phoneCode}
            onChange={(e) => st.do.setPhoneCode(e.target.value)}
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
          />
          {!signupKeyring?.verifies.includes("phone") && phoneCodeAt && (
            <div className="absolute flex items-center top-3.5 text-sm align-middle text-color-main-light right-32">
              {Utils.pad(phoneCodeRemain.minute, 2)}:{Utils.pad(phoneCodeRemain.second, 2)}
            </div>
          )}
          <button
            className="w-20 btn btn-primary text-xs"
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
            onClick={async () => st.do.signupPhone(loginForm)}
          >
            {signupKeyring?.verifies.includes("phone") ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </>
  );
};

interface SignupPasswordProps {
  siteKey: string;
  loginForm?: Partial<LoginForm>;
}

export const SignUpPassword = ({ siteKey, loginForm }: SignupPasswordProps) => {
  const password = st.use.password();
  const turnstileToken = st.use.turnstileToken();
  const keyringForm = st.use.keyringForm();
  const isSubmitable = turnstileToken && Utils.isEmail(keyringForm.accountId) && password.length >= 7;
  return (
    <>
      <div className="flex items-baseline mb-2">
        <p className="w-28">Email</p>
        <Input
          className="w-full"
          status={Utils.isEmail(keyringForm.accountId) ? "" : "error"}
          placeholder="gavin@hooli.com"
          value={keyringForm.accountId ?? ""}
          onChange={(e) => st.do.setAccountIdOnKeyring(e.target.value)}
        />
      </div>
      <div className="flex items-baseline mb-2">
        <p className="w-28">Password</p>
        <Input.Password
          className="w-full"
          status={password.length >= 7 ? "" : "error"}
          value={password}
          onChange={(e) => st.do.setPassword(e.target.value)}
          onPressEnter={() => isSubmitable && st.do.signinPassword()}
        />
      </div>
      <div className="flex justify-center mb-2">
        <Turnstile
          siteKey={siteKey}
          options={{ theme: "light" }}
          onSuccess={(token) => st.do.setTurnstileToken(token)}
        />
      </div>
      <button
        className="w-full btn"
        disabled={!Utils.isEmail(keyringForm.accountId) || password.length < 7}
        onClick={async () => await st.do.signupPassword(loginForm)}
      >
        Register
      </button>
    </>
  );
};

export const SignInPassword = ({ siteKey, loginForm = {} }: { siteKey: string; loginForm?: Partial<LoginForm> }) => {
  const password = st.use.password();
  const turnstileToken = st.use.turnstileToken();
  const keyringForm = st.use.keyringForm();
  const isSubmitable = turnstileToken && Utils.isEmail(keyringForm.accountId) && password.length >= 7;
  return (
    <>
      <div className="flex items-baseline mb-2">
        <p className="w-28">Email</p>
        <Input
          className="w-full"
          status={Utils.isEmail(keyringForm.accountId) ? "" : "error"}
          placeholder="gavin@hooli.com"
          value={keyringForm.accountId ?? ""}
          onChange={(e) => st.do.setAccountIdOnKeyring(e.target.value)}
        />
      </div>
      <div className="flex items-baseline mb-2">
        <p className="w-28">Password</p>
        <Input.Password
          className="w-full"
          status={password.length >= 7 ? "" : "error"}
          value={password}
          onChange={(e) => st.do.setPassword(e.target.value)}
          onPressEnter={() => isSubmitable && st.do.signinPassword()}
        />
      </div>
      <div className="flex justify-center mb-2">
        <Turnstile
          siteKey={siteKey}
          options={{ theme: "light" }}
          onSuccess={(token) => st.do.setTurnstileToken(token)}
        />
      </div>
      <button
        className="w-full btn btn-outline"
        disabled={!isSubmitable}
        onClick={() => st.do.signinPassword({ loginType: "signin", ...loginForm })}
      >
        Sign In
      </button>
    </>
  );
};

export const ChangePasswordWithPhone = () => {
  const password = st.use.password();
  const passwordConfirm = st.use.passwordConfirm();
  const myKeyring = st.use.myKeyring();
  const keyringModal = st.use.keyringModal();
  return (
    <>
      <button className="btn btn-sm" onClick={() => st.do.setKeyringModal("changePasswordWithPhone")}>
        변경
      </button>
      <Modal
        open={keyringModal === "changePasswordWithPhone"}
        onCancel={() => st.do.setKeyringModal(null)}
        title="비밀번호 변경"
        onOk={() => st.do.changePasswordWithPhone()}
        okButtonProps={{
          disabled: password.length < 7 || !myKeyring.isPhoneVerified() || password !== passwordConfirm,
        }}
      >
        <VerifyPhone disabled={false} />
        <Field.Password label="새 비밀번호" value={password} onChange={st.do.setPassword} />
        <Field.Password label="새 비밀번호 확인" value={passwordConfirm} onChange={st.do.setPasswordConfirm} />
      </Modal>
    </>
  );
};

export const ChangePassword = ({ siteKey }: { siteKey: string }) => {
  const { l } = useLocale();
  const password = st.use.password();
  const prevPassword = st.use.prevPassword();
  const keyringModal = st.use.keyringModal();
  const passwordConfirm = st.use.passwordConfirm();
  const turnstileToken = st.use.turnstileToken();
  return (
    <>
      <button className="btn btn-sm" onClick={() => st.do.setKeyringModal("changePassword")}>
        {l("keyring.changePassword")}
      </button>
      <Modal
        open={keyringModal === "changePassword"}
        onCancel={() => st.do.setKeyringModal(null)}
        title="비밀번호 변경"
        onOk={() => st.do.changePassword()}
        okButtonProps={{ disabled: password.length < 7 || password !== passwordConfirm || !turnstileToken }}
      >
        <div className="flex items-baseline mb-2">
          <p className="w-60">{l("keyring.prevPassword")}</p>
          <Input.Password
            className="w-full"
            value={prevPassword}
            onChange={(e) => st.do.setPrevPassword(e.target.value)}
          />
        </div>
        <div className="flex items-baseline mb-2">
          <p className="w-60">{l("keyring.newPassword")}</p>
          <Input.Password className="w-full" value={password} onChange={(e) => st.do.setPassword(e.target.value)} />
        </div>
        <div className="flex items-baseline mb-2">
          <p className="w-60">{l("keyring.passwordConfirm")}</p>
          <Input.Password
            className="w-full"
            value={passwordConfirm}
            onChange={(e) => st.do.setPasswordConfirm(e.target.value)}
          />
        </div>
        <div className="flex justify-center mb-2">
          <Turnstile
            siteKey={siteKey}
            options={{ theme: "light" }}
            onSuccess={(token) => st.do.setTurnstileToken(token)}
          />
        </div>
      </Modal>
    </>
  );
};

interface SSOButtonsProps {
  className?: string;
  uri: string;
  ssoTypes: cnst.SsoType[];
}

export const SSOButtons = ({ className, uri, ssoTypes }: SSOButtonsProps) => {
  const icons: { [key in cnst.SsoType]: ReactNode } = {
    github: <Github className="bg-white rounded-full shadow-md cursor-pointer" />,
    kakao: <Kakao className="rounded-full shadow-md cursor-pointer" />,
    naver: <Naver className="rounded-full cursor-pointer bg-[#1ec800] fill-white shadow-md" />,
    google: <Google className="bg-white rounded-full shadow-md cursor-pointer" />,
    facebook: <Facebook className="rounded-full shadow-md cursor-pointer" />,
    apple: <Apple className="rounded-full shadow-md cursor-pointer" />,
  };
  return (
    <div className={twMerge("flex justify-between", className)}>
      {ssoTypes.map((ssoType) => (
        <Link href={`${uri}/auth/${ssoType}`} passHref>
          {icons[ssoType]}
        </Link>
      ))}
    </div>
  );
};
