import { useEffect } from "react";
import { PlatformLayout } from "@platform/ui-web";
import { Header, CreateButton, CreateBox, Body } from "../../components";
import styled from "styled-components";
import { cnst } from "@shared/util";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";
import { gql, utils, store } from "../../stores";

export function Survey() {
  const initMocSurvey = store.mocSurvey.use.initMocSurvey();
  const isWriteMode = store.mocSurvey.use.isWriteMode();
  // console.log("");
  useEffect(() => {
    initMocSurvey({ status: { $in: ["opened", "closed"] } });
  }, []);

  return (
    <PlatformLayout>
      <Header />
      <Body />
      <CreateButton />
      {isWriteMode && (
        <SurveyCreateMobile className="only-mobile">
          <CreateBox />
        </SurveyCreateMobile>
      )}
    </PlatformLayout>
  );
}

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
