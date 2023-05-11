import { useEffect } from "react";
import { Header, CreateButton, CreateBox, Body } from "../../components";
import { cnst } from "@shared/util";
import { GqlProvider } from "@shared/ui-web";
import { env } from "../../env/env";
import { gql, st, store } from "../../stores";

export function Survey() {
  const self = st.use.self();
  const isWriteMode = st.use.isWriteMode();
  const thingList = st.use.thingList();

  useEffect(() => {
    st.do.initMocSurvey({ query: { status: { $in: ["opened", "closed"] } } });
  }, []);
  //!need to change
  return (
    <div>
      <Header />
      <Body />
      <CreateButton />
      {isWriteMode && (
        <div className="block md:hidden absolute inset-0 w-full h-screen p-[10px] bg-white">
          <CreateBox />
        </div>
      )}
    </div>
  );
}

export default Survey;
