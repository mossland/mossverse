import { LoginButton, LoginSelector, LoginSelectorMobile } from "@shared/ui-web";
import { gql, st, store } from "../../stores";

export const Connect = () => {
  const networkList = st.use.networkList();
  if (networkList === "loading") return <>loading...</>;

  return (
    <>
      <div className="flex justify-end w-full">
        <LoginButton title={"Login"} />
      </div>
      <div className="only-mobile">
        <LoginSelectorMobile networkList={networkList.sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
      </div>
      <div className="only-pc">
        <LoginSelector networkList={networkList.sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
      </div>
    </>
  );
};
