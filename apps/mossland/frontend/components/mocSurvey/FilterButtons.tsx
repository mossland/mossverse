import { Survey } from "@platform/ui-web";
import styled, { css } from "styled-components";
import { cnst } from "@shared/util";
import { CheckIcon } from "@shared/ui-web";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";
import { MocSurveyFilter } from "./MocSurveyFilter";
type CustomProps = { filter?: cnst.SurveyFilterType };

export const FilterButtons = () => {
  const mocSurveyService = useMocSurvey();

  if (!mocSurveyService.self && !mocSurveyService.mocSurveyList) return <></>;
  return (
    <MocSurveyFilter>
      <MocSurveyFilter.Button
        className={`bg-[#A0E3FF] ${mocSurveyService.filter !== "all" && "opacity-50"}`}
        onClick={() => mocSurveyService.changeFilter("all")}
      >
        {mocSurveyService.filter === "all" && <CheckIcon />}
        {`All(${mocSurveyService.allCount})`}
      </MocSurveyFilter.Button>
      <MocSurveyFilter.Button
        className={`bg-[#FFE177] ${mocSurveyService.filter !== "active" && "opacity-50"}`}
        onClick={() => mocSurveyService.changeFilter("active")}
      >
        {mocSurveyService.filter === "active" && <CheckIcon />}
        {`Active(${mocSurveyService.activeCount})`}
      </MocSurveyFilter.Button>
    </MocSurveyFilter>
  );
};

const Container = styled.div<CustomProps>`
  display: flex;
  position: absolute;
  bottom: 14px;

  .all-button {
    border-color: ${(props) => (props.filter === "all" ? "black" : "gray")};
    color: ${(props) => (props.filter === "all" ? "black" : "gray")};
  }
  .active-button {
    border-color: ${(props) => (props.filter === "active" ? "black" : "gray")};
    color: ${(props) => (props.filter === "active" ? "black" : "gray")};
  }
`;
