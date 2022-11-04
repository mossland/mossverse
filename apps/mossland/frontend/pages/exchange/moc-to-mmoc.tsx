import { PlatformLayout } from "@platform/ui-web";
import styled from "styled-components";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env";
import { usePageInit } from "../../hooks";
import { McoToMmocHeader, ExchangeAddressBar, MocToMmocFooter } from "../../components";
import { gql, utils, store } from "../../stores";

export function MocToMmoc() {
  usePageInit();
  const mocWallet = store.mocWallet.use.mocWallet();

  return (
    <GqlProvider uri={env.endpoint} ws={env.ws} networkType={env.networkType}>
      <PlatformLayout>
        <McoToMmocHeader />
        <ExchangeAddressBar address={mocWallet?.address ?? ""} />
        <MocToMmocFooter />
      </PlatformLayout>
    </GqlProvider>
  );
}

export default MocToMmoc;

const ExchangeContainer = styled.div`
  padding: 0px 22px;
`;
