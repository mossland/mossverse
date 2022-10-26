import { LoginButton, LoginSelector, LoginSelectorMobile } from "@shared/ui-web";
import { types, userStore } from "@platform/data-access";
import { keyringStore, networkStore, walletStore } from "@shared/data-access";
import { toast } from "react-toastify";

import styled from "styled-components";

export const Connect = () => {
  const initUser = userStore.use.init();
  const networks = networkStore.use.networks();
  const login = keyringStore.use.login();
  const signWalletConnect = keyringStore.use.signWalletConnect();
  // const changeLoginMethod = keyringStore.setState({ loginMethod });

  const onClickLoginSelect = async (loginMethod: types.shared.LoginMethod) => {
    // try {
    const network = networks.find((network) => network.provider === loginMethod);
    if (!network) return;
    await login(loginMethod);
    await initUser();
    keyringStore.setState({ isOpenModal: false });
    // } catch (err) {
    //   console.log(err);
    //   // err instanceof Error &&
    //   //   err.message.includes("User denied message signature.") &&
    //   toast.error("User denied message signature.");
    // }
  };
  const onClickButtonToMobile = async (loginMethod: types.shared.LoginMethod) => {
    try {
      await signWalletConnect(loginMethod);
      await initUser();
      keyringStore.setState({ signStatus: "none", isOpenModal: false });
    } catch (err) {
      err instanceof Error &&
        err.message.includes("User denied message signature.") &&
        toast.error("User denied message signature.");
    }
  };
  return (
    <>
      <Container>
        <LoginButton title={"Login"} />
      </Container>
      <LoginSelectorContainer>
        <div className="only-mobile">
          <LoginSelectorMobile
            ethereum={async () => await onClickButtonToMobile("ethereum")}
            klaytn={async () => await onClickButtonToMobile("klaytn")}
          />
        </div>
        <div className="only-pc">
          <LoginSelector
            ethereum={async () => await onClickLoginSelect("ethereum")}
            klaytn={async () => await onClickLoginSelect("klaytn")}
          />
        </div>
      </LoginSelectorContainer>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const LoginSelectorContainer = styled.div`
  .modal {
    position: fixed;
  }
`;

const Button = styled.button<{ backgroundColor?: string }>`
  width: 166px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000000;
  border-radius: 10px;
  font-family: Ubuntu Mono;
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 22px;
  :enabled {
    cursor: pointer;
    background-color: ${(props) => props.backgroundColor ?? "white"};

    :hover {
      opacity: 0.5;
    }
  }
  :disabled {
    background-color: ${(props) => props.backgroundColor ?? "white"};
    border-color: gray;
    color: gray;
  }
`;
