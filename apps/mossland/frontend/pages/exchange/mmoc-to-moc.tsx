import { PlatformLayout } from "@platform/ui-web";
import { MyBalance, MmocToMocForm, MmocToMocHeader, MmcoToMocFooter } from "../../components";
import styled from "styled-components";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";

export function MmocToMoc() {
  return (
    <GqlProvider uri={env.endpoint} ws={env.ws} networkType={env.networkType}>
      <PlatformLayout>
        <MmocToMocHeader />
        <ExchangeContainer>
          <MyBalance isHideMoc />
          <MmocToMocForm />
        </ExchangeContainer>
        <MmcoToMocFooter />
      </PlatformLayout>
    </GqlProvider>
  );
}

export default MmocToMoc;

const ExchangeContainer = styled.div`
  padding: 0px 22px;
`;
