import { PlatformLayout } from "@platform/ui-web";
import { MyBalance, MmocToMocForm, MmocToMocHeader, MmcoToMocFooter } from "../../components";
import styled from "styled-components";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env";
import { usePageInit } from "../../hooks";
import { McoToMmocHeader, ExchangeAddressBar, McoToMmocFooter } from "../../components";
import { mocWalletStore } from "apps/mossland/frontend/stores";

export function MocToMmoc() {
  usePageInit();
  const mocWallet = mocWalletStore.use.mocWallet();

  return (
    <GqlProvider uri={env.endpoint}>
      <PlatformLayout>
        <McoToMmocHeader />
        <ExchangeAddressBar address={mocWallet?.address ?? ""} />
        <McoToMmocFooter />
      </PlatformLayout>
    </GqlProvider>
  );
}

export default MocToMmoc;

const ExchangeContainer = styled.div`
  padding: 0px 22px;
`;
