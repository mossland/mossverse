import { LoginButton, LoginSelector, LoginSelectorMobile } from "@shared/ui-web";
import { gql, utils, store } from "../../stores";
import { toast } from "react-toastify";

import styled from "styled-components";

export const Connect = () => {
  const networkList = store.shared.network.use.networkList();
  if (networkList === "loading") return <>loading...</>;

  return (
    <>
      <Container>
        <LoginButton title={"Login"} />
      </Container>
      <LoginSelectorContainer>
        <div className="only-mobile">
          <LoginSelectorMobile networkList={networkList.sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
        </div>
        <div className="only-pc">
          <LoginSelector networkList={networkList.sort((a, b) => (a.provider === "klaytn" ? 0 : 1))} />
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
