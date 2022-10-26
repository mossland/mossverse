import { PlatformLayout } from "@platform/ui-web";
import { MyBalance, MmocToMocForm, MmocToMocHeader, MmcoToMocFooter } from "../../components";
import styled from "styled-components";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env";
import { usePageInit } from "../../hooks";

export function MmocToMoc() {
  usePageInit();

  return (
    <GqlProvider uri={env.endpoint}>
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
