import { useEffect } from "react";
import { PlatformLayout } from "@platform/ui-web";
import { SurveyList, SurveyDetail, SurveyHeader, SurveyCreateButton, SurveyCreate } from "../../components";
import { keyringStore, networkStore } from "@shared/data-access";
import styled from "styled-components";
import { cnst } from "@shared/util";
import { GqlProvider } from "@shared/ui-web";
import { usePageInit } from "../../hooks";
import { env } from "../../env";
import { mocSurveyStore } from "apps/mossland/frontend/stores";

export function Survey() {
  usePageInit();
  const initSurvey = mocSurveyStore.use.init();
  const isWriteMode = mocSurveyStore.use.isWriteMode();

  useEffect(() => {
    initSurvey();
  }, []);

  return (
    <GqlProvider uri={env.endpoint}>
      <PlatformLayout>
        <SurveyHeader />
        <SurveyBody>
          <SurveyList />
          <SurveyDetail />
        </SurveyBody>
        <SurveyCreateButton />
        {isWriteMode && (
          <SurveyCreateMobile className="only-mobile">
            <SurveyCreate />
          </SurveyCreateMobile>
        )}
      </PlatformLayout>
    </GqlProvider>
  );
}

const SurveyBody = styled.div`
  height: calc(100vh - 107px);
  display: flex;
  border-top: 2px solid ${(props) => props.theme.color.black};
  overflow-y: auto;
`;

const SurveyCreateMobile = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  padding: 10px;
  background-color: white;
`;

export default Survey;
