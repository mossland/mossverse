import { LoginButton, LoginSelector, LoginSelectorMobile } from "@shared/ui-web";
import { gql, utils, store } from "../../stores";
import { toast } from "react-toastify";

import styled from "styled-components";

export const Connect = () => {
  const whoAmI = store.platform.user.use.whoAmI();
  const networkList = store.shared.network.use.networkList();
  const login = store.shared.keyring.use.login();
  const signWalletConnect = store.shared.keyring.use.signWalletConnect();
  const onClickLoginSelect = async (loginMethod: gql.shared.LoginMethod) => {
    const network = networkList.find((network) => network.provider === loginMethod);
    if (!network) return;
    await login(loginMethod);
    await whoAmI();
    store.shared.keyring.setState({ isOpenModal: false }); // ! 추상화 필요
  };
  const onClickButtonToMobile = async (loginMethod: gql.shared.LoginMethod) => {
    try {
      await signWalletConnect(loginMethod);
      await whoAmI();
      store.shared.keyring.setState({ signStatus: "none", isOpenModal: false });
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
