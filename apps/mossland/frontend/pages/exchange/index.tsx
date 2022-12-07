import { PageTitle, PlatformLayout, DefaultButton } from "@platform/ui-web";
import {
  MyBalance,
  ExchangeList,
  McoToMmocHeader,
  MmocToMocHeader,
  MmocToMocForm,
  MmcoToMocFooter,
  ReceiptModal,
  ExchangeButtons,
  DepositStep,
  ExchangeHeader,
} from "../../components";
import styled from "styled-components";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";
import { useageInit } from "../../hooks";

export function Exchange() {
  return (
    <GqlProvider uri={env.endpoint} ws={env.ws} networkType={env.networkType}>
      <PlatformLayout>
        <ExchangeHeader />
        <ExchangeBody>
          <div className="exchange-list">
            <div className="only-pc history-title">History</div>
            <ExchangeList />
          </div>
          <div className="only-pc exchange-funcs">
            <McoToMmocHeader />
            <DepositStep />
            <MmocToMocHeader />
            <div className="mmoc-to-moc">
              <MmocToMocForm />
              <MmcoToMocFooter />
            </div>
          </div>
        </ExchangeBody>
        <ReceiptModal />
      </PlatformLayout>
    </GqlProvider>
  );
}

export default Exchange;

const ExchangeBody = styled.div`
  border-top: 2px solid ${(props) => props.theme.color.black};
  display: flex;
  height: auto;
  overflow-y: auto;
    position: relative;
    height: calc(100vh - 102px);
  }
  .exchange-list {
    flex: 1;
  
    .history-title {
      height: 44px;
      font-size: 22px;
      line-height: 44px;
      text-align: center;
      /* masrgin: 20px 0; */
      border-bottom: 2px solid ${(props) => props.theme.color.black};
    }
  }
  .exchange-funcs {
    flex: 1;
    border-left: 2px solid ${(props) => props.theme.color.black};
    height: fit-content;
    position: relative;
 
  .mmoc-to-moc{
    padding: 23px 23px;
    margin-left: -2px;
    .footer-button {
      padding: 25px 0px;
    }
  }
`;
