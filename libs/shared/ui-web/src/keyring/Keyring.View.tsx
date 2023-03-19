import { gql, st, slice, useLocale } from "@shared/data-access";
import { Keyring, RecentTime } from "@shared/ui-web";
import Router from "next/router";
import { twMerge } from "tailwind-merge";

interface KeyringViewProps {
  className?: string;
  keyring: gql.Keyring;
  slice?: slice.KeyringSlice;
  siteKey?: string;
}
export const KeyringView = ({ className, keyring, slice = st.slice.keyring, siteKey }: KeyringViewProps) => {
  const { l } = useLocale();
  return (
    <div className={twMerge(className, ``)}>
      <div>
        <div className="font-bold">이메일</div>
        <p className="text-base">{keyring.accountId}</p>
      </div>
      <div>
        <div className="font-bold">비밀번호</div>
        <p className="text-base">
          ********{" "}
          {keyring.verifies.includes("phone") ? (
            <Keyring.Action.ChangePasswordWithPhone />
          ) : siteKey ? (
            <Keyring.Action.ChangePassword siteKey={siteKey} />
          ) : null}
        </p>
      </div>
    </div>
  );
};
