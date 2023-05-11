import { cnst } from "@shared/util";
import { CheckIcon } from "@shared/ui-web";
import { gql, st, store } from "../../stores";
import { MocSurveyFilter } from "./MocSurveyFilter";
import { useEffect } from "react";
import Router from "next/router";
type CustomProps = { filter?: cnst.SurveyFilterType };

export const FilterButtons = () => {
  // const mocSurveyService = useMocSurvey();
  const self = st.use.self();
  const mocSurveyList = st.use.mocSurveyList();
  const filter = Router.query.filter as cnst.SurveyFilterType;
  // if (!self && !mocSurveyList) return <></>;

  useEffect(() => {
    if (!self) return;

    if (filter === "all")
      st.do.setQueryOfMocSurvey({
        status: "opened",
      });
    if (filter === "active")
      st.do.setQueryOfMocSurvey({
        status: "opened",
        // responses: { $elemMatch: { user: self.id } },
      });
  }, [filter]);
  return (
    <MocSurveyFilter>
      <MocSurveyFilter.Button
        className={`bg-[#A0E3FF] ${filter !== "all" && "opacity-50"}`}
        onClick={() => Router.push({ query: { filter: "all" } })}
      >
        {filter === "all" && <CheckIcon />}
        {`All${filter === "all" ? `(${mocSurveyList.length})` : ""}`}
      </MocSurveyFilter.Button>
      <MocSurveyFilter.Button
        className={`bg-[#FFE177] ${filter !== "active" && "opacity-50"}`}
        onClick={() => Router.push({ query: { filter: "active" } })}
      >
        {filter === "active" && <CheckIcon />}
        {`Active${filter === "active" ? `(${mocSurveyList.length})` : ""}`}
      </MocSurveyFilter.Button>
    </MocSurveyFilter>
  );
};
