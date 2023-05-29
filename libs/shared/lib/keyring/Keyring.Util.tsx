"use client";
import { AiFillCheckCircle, AiFillGithub, AiOutlineDelete, AiOutlineDollar, AiOutlineKey } from "react-icons/ai";
import {
  Apple,
  DataDashboard,
  Facebook,
  Google,
  Input,
  Kakao,
  Modal,
  Naver,
  Spin,
  fetch,
  st,
  usePage,
} from "@shared/client";
import { DataMenuItem, LoginForm, ModelDashboardProps, Utils, client, cnst, useInterval } from "@util/client";
import { ReactNode, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import dayjs from "dayjs";

export const Menu: DataMenuItem = {
  key: "keyring",
  label: "Keyring",
  icon: <AiOutlineKey />,
  render: () => <AiOutlineDollar />,
};

export const Stat = ({
  summary,
  sliceName = "keyring",
  queryMap = fetch.keyringQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.KeyringSummary>) => {
  return (
    <DataDashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalKeyring", "activeKeyring", "inProgressKeyring", "resolvedKeyring"]}
      hidePresents={hidePresents}
    />
  );
};

interface VerifyPhoneProps {
  disabled?: boolean;
  hash?: string;
}
export const VerifyPhone = ({ disabled, hash = "verify" }: VerifyPhoneProps) => {
  const myKeyring = st.use.myKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({
    minute: 0,
    second: 0,
  });
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({
      minute: Math.floor(remainSec / 60),
      second: remainSec % 60,
    });
  }, 1000);
  return (
    <>
      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-36">전화번호</div>
        <div className="flex w-full rounded-r-none">
          <Input inputClassName="rounded-r-none w-48" value={myKeyring.phone ?? ""} disabled={true} />
          <button
            className={`btn rounded-l-none w-24 ${!phoneCodeAt && "btn-primary"}`}
            disabled={disabled || !Utils.isPhoneNumber(myKeyring.phone) || myKeyring.isPhoneVerified()}
            onClick={async () => myKeyring.phone && st.do.requestPhoneCode(myKeyring.id, myKeyring.phone, hash)}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>

      <div className="flex my-6">
        <div className="flex items-center justify-center mr-4 align-middle w-36">인증번호</div>
        <div className="relative flex w-full">
          <Input
            type="number"
            inputClassName="rounded-r-none w-48"
            value={phoneCode}
            onChange={(e) => st.do.setPhoneCode(e.target.value)}
            disabled={!phoneCodeAt || myKeyring.isPhoneVerified()}
          />
          {!myKeyring.isPhoneVerified() && phoneCodeAt && (
            <div className="absolute flex items-center h-8 text-sm align-middle text-primary/70 left-36 top-2">
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
  className?: string;
  disabled: boolean;
  hash?: string;
  loginForm?: Partial<LoginForm>;
}
export const SignupPhone = ({ className, disabled, hash = "signup", loginForm }: SignupPhoneProps) => {
  const signupKeyring = st.use.signupKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({
    minute: 0,
    second: 0,
  });
  const keyringForm = st.use.keyringForm();
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({
      minute: Math.floor(remainSec / 60),
      second: remainSec % 60,
    });
  }, 1000);
  return (
    <div className={twMerge("flex flex-col gap-6 my-6", className)}>
      <div className="flex">
        <div className="flex items-center justify-end mr-4 md:text-base text-[12px]  align-baseline w-28">전화번호</div>
        <div className="flex w-full input-group">
          <Input
            className="w-full"
            inputClassName="w-full rounded-r-none"
            value={keyringForm.phone ?? ""}
            onChange={(e) => st.do.setPhoneOnKeyring(Utils.formatPhone(e.target.value))}
            disabled={signupKeyring?.verifies.includes("phone")}
          />
          <button
            className={`w-20 btn ${!phoneCodeAt && "btn-primary"}   text-xs disabled:border-gray-300 `}
            disabled={disabled || !Utils.isPhoneNumber(keyringForm.phone) || signupKeyring?.verifies.includes("phone")}
            onClick={async () => {
              if (!keyringForm.phone) return;
              const keyringIdHasPhone = await fetch.getKeyringIdHasPhone(keyringForm.phone);
              if (keyringIdHasPhone) return window.alert("이미 사용중인 전화번호입니다.");
              const keyring = await fetch.addPhoneInPrepareKeyring(keyringForm.phone, signupKeyring?.id ?? null);
              st.do.requestPhoneCode(keyring.id, keyringForm.phone);
              st.set({ signupKeyring: keyring });
            }}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center justify-end mr-4 md:text-base text-[12px]  align-baseline w-28">인증번호</div>
        <div className="relative flex w-full input-group">
          <Input
            className="w-full"
            inputClassName="w-full rounded-r-none"
            value={phoneCode}
            onChange={(e) => st.do.setPhoneCode(e.target.value)}
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
          />
          {!signupKeyring?.verifies.includes("phone") && phoneCodeAt && (
            <div className="absolute flex items-center top-3.5 text-sm align-middle text-primary/70 right-24">
              {Utils.pad(phoneCodeRemain.minute, 2)}:{Utils.pad(phoneCodeRemain.second, 2)}
            </div>
          )}
          <button
            className="w-20 text-xs btn btn-primary disabled:border-gray-300"
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
            onClick={async () => st.do.signupPhone(loginForm)}
          >
            {signupKeyring?.verifies.includes("phone") ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SignupPasswordProps {
  siteKey: string;
  loginForm?: Partial<LoginForm>;
  onSignup?: () => void;
}

export const SignUpPassword = ({ siteKey, loginForm, onSignup }: SignupPasswordProps) => {
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
          placeholder="이메일을 입력하세요."
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
        onClick={async () => {
          await st.do.signupPassword(loginForm);
          onSignup?.();
        }}
      >
        Register
      </button>
    </>
  );
};

export const SignInPassword = ({ siteKey, loginForm = {} }: { siteKey: string; loginForm?: Partial<LoginForm> }) => {
  const { l, lang } = usePage();
  const password = st.use.password();
  const turnstileToken = st.use.turnstileToken();
  const keyringForm = st.use.keyringForm();
  const isSubmitable = turnstileToken && Utils.isEmail(keyringForm.accountId) && password.length >= 7;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    return () => {
      st.do.setAccountIdOnKeyring("");
      st.do.setPassword("");
      st.do.setTurnstileToken("");
    };
  }, []);
  return (
    <>
      <div className="flex items-baseline w-full mb-2">
        <div className="w-28">{l("keyring.accountId")}</div>
        <Input
          className="w-full"
          inputClassName="w-full h-10 min-h-10 placeholder:text-sm"
          // status={!keyringForm.accountId || Utils.isEmail(keyringForm.accountId) ? "" : "error"}
          placeholder="email을 입력하세요."
          value={keyringForm.accountId ?? ""}
          onChange={(e) => st.do.setAccountIdOnKeyring(e.target.value)}
        />
      </div>
      <div className="flex items-baseline w-full">
        <div className="w-28">{l("keyring.password")}</div>
        <Input.Password
          className="w-full"
          inputClassName="w-full h-10 min-h-10 placeholder:text-sm"
          // status={!password.length || password.length >= 7 ? "" : "error"}
          value={password}
          onChange={(e) => st.do.setPassword(e.target.value)}
          onPressEnter={() => isReady && isSubmitable && st.do.signinPassword()}
        />
      </div>
      <div className="flex justify-end w-full mt-1 mb-2 duration-300 hover:opacity-50">
        <Link href="/forgotpassword" className="underline">
          {l("keyring.forgotPassword")}
        </Link>
      </div>
      <Turnstile
        siteKey={siteKey}
        options={{ theme: "light", size: "invisible" }}
        onSuccess={(token) => {
          st.do.setTurnstileToken(token);
          setIsReady(true);
        }}
      />
      <button
        className={`w-full md:mt-5 btn ${!isReady ? "btn-disabled" : "btn-primary"} gap-2 disabled:border-primary`}
        disabled={!isSubmitable}
        onClick={() => st.do.signinPassword(loginForm)}
      >
        {l("shared.signIn")}
        <div className="w-4">
          {!isReady ? (
            <Spin />
          ) : (
            <div className="text-lg duration-200 animate-pop">
              <AiFillCheckCircle />
            </div>
          )}
        </div>
      </button>
    </>
  );
};

export const ChangePasswordWithPhone = () => {
  const { l } = usePage();
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
        <VerifyPhone />
        <div className="flex">
          <div className="flex items-center justify-center mr-3 align-middle w-28">{l("keyring.newPassword")}</div>
          <Input.Password
            className="w-72"
            inputClassName="w-full"
            value={password}
            onChange={(e) => st.do.setPassword(e.target.value)}
          />
        </div>
        <div className="flex mt-6">
          <div className="flex items-center justify-center mr-3 align-middle w-28">{l("keyring.passwordConfirm")}</div>
          <Input.Password
            className="w-72"
            inputClassName="w-full"
            value={passwordConfirm}
            onChange={(e) => st.do.setPasswordConfirm(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export const ChangePassword = ({ siteKey }: { siteKey: string }) => {
  const { l } = usePage();
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
        okButtonProps={{
          disabled: password.length < 7 || password !== passwordConfirm || !turnstileToken,
        }}
      >
        <div className="flex items-baseline justify-center mb-2">
          <div className="w-32">{l("keyring.prevPassword")}</div>
          <Input.Password value={prevPassword} onChange={(e) => st.do.setPrevPassword(e.target.value)} />
        </div>
        <div className="flex items-baseline justify-center mb-2">
          <div className="w-32">{l("keyring.newPassword")}</div>
          <Input.Password value={password} onChange={(e) => st.do.setPassword(e.target.value)} />
        </div>
        <div className="flex items-baseline justify-center mb-2">
          <div className="w-32">{l("keyring.passwordConfirm")}</div>
          <Input.Password value={passwordConfirm} onChange={(e) => st.do.setPasswordConfirm(e.target.value)} />
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
  const { l } = usePage();
  const buttons: { [key in cnst.SsoType]: ReactNode } = {
    github: (
      <button className="relative flex items-center w-full text-white bg-black border-none shadow btn">
        <AiFillGithub className="absolute left-[18px] text-white text-4xl" />
        {l("keyring.signWithGithub")}
      </button>
    ),
    kakao: (
      <button className="w-full btn relative flex items-center border-none shadow bg-[#FEE500] text-[#3c1e1e] hover:text-white">
        <Kakao className="absolute rounded-full left-4" />
        {l("keyring.signWithKakao")}
      </button>
    ),
    naver: (
      <button className="w-full btn relative flex items-center border-none shadow bg-[#1ec800] text-white hover:text-white">
        <Naver className="absolute rounded-full left-4 fill-white" />
        {l("keyring.signWithNaver")}
      </button>
    ),
    google: (
      <button className="relative flex items-center w-full text-black bg-white border border-gray-200 shadow btn">
        <Google className="absolute rounded-full left-4" />
        {l("keyring.signWithGoogle")}
      </button>
    ),
    facebook: (
      <button className="w-full btn relative flex items-center border-none shadow bg-[#039be5] text-white">
        <Facebook className="absolute left-[22px] rounded-full bg-white" width={30} />
        {l("keyring.signWithFacebook")}
      </button>
    ),
    apple: (
      <button className="relative flex items-center w-full text-white bg-black border-none shadow btn">
        <Apple className="absolute rounded-full left-4" />
        {l("keyring.signWithApple")}
      </button>
    ),
  };
  return (
    <div className={twMerge("flex flex-col gap-1.5 md:gap-2 justify-between w-full", className)}>
      {ssoTypes.map((ssoType) => (
        <Link href={`${uri}/auth/${ssoType}`} passHref key={ssoType}>
          {buttons[ssoType]}
        </Link>
      ))}
    </div>
  );
};

export const ForgotPassword = () => {
  const { l } = usePage();
  const keyringForm = st.use.keyringForm();
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="mb-4 text-2xl font-bold text-center">{l("keyring.forgotPassword")}</div>
      <div className="mb-6">{l("keyring.forgotPasswordDesc")}</div>
      <div className="flex items-baseline w-full mb-2">
        <div className="w-28">{l("keyring.accountId")}</div>
        <Input
          className="w-full"
          inputClassName="w-full"
          placeholder="gavin@hooli.com"
          status={Utils.isEmail(keyringForm.accountId) ? "" : "error"}
          value={keyringForm.accountId ?? ""}
          onChange={(e) => st.do.setAccountIdOnKeyring(e.target.value)}
        />
      </div>
      <button
        className="w-full btn"
        disabled={!Utils.isEmail(keyringForm.accountId)}
        onClick={async () => {
          st.do.showMessage({ content: "Sending email...", key: "forgotPassword", type: "loading" });
          try {
            await fetch.resetPassword(keyringForm.accountId ?? "");
            st.do.showMessage({ content: "Email Sent", key: "forgotPassword", type: "success" });
          } catch (e) {
            st.do.showMessage({ content: e.message, key: "forgotPassword", type: "error" });
          }
        }}
      >
        {l("keyring.sendResetEmail")}
      </button>
    </div>
  );
};

export const SignsubWallet = ({ id }: { id: string }) => {
  return (
    <button
      className="btn btn-outline"
      onClick={async () => {
        st.do.showMessage({ content: "Deleting...", key: "deleteWallet", type: "loading" });
        const keyring = await fetch.signsubWallet(id);
        st.set({ myKeyring: keyring });
        st.do.showMessage({ content: "Deleted", key: "deleteWallet", type: "success" });
      }}
    >
      <AiOutlineDelete />
    </button>
  );
};
export const SignaddWallet = () => {
  const myKeyring = st.use.myKeyring();
  return (
    <button
      onClick={async () => {
        //! Temp
        st.do.showMessage({
          content: "Creating wallet...",
          key: "createWallet",
          type: "loading",
          duration: 30,
        });
        const network = (await fetch.listNetwork({})).listNetwork[0];
        if (!network) return;
        if (!client.isSigned()) return window.alert("Wallet is not signed");
        if (myKeyring.wallets.some((wallet) => wallet.address === client.address))
          return window.alert("Already added, please change wallet and retry");
        const keyring = await fetch.signaddWallet(network.id);
        st.set({ myKeyring: keyring });
        st.do.showMessage({ content: "Created wallet", key: "createWallet" });
      }}
      className="px-2 py-1 text-xs transition duration-500 bg-gray-100 border border-gray-300 rounded-sm cursor-pointer w-fit hover:bg-gray-200"
    >
      Add Wallet
    </button>
  );
};
