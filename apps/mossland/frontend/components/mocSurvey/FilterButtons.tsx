import { Survey } from "@platform/ui-web";
import styled, { css } from "styled-components";
import { cnst } from "@shared/util";
import { CheckIcon } from "@shared/ui-web";
import { gql, utils, store } from "../../stores";
import { useMocSurvey } from "./services/useMocSurvey";

type CustomProps = { filter?: cnst.SurveyFilterType };

export const FilterButtons = () => {
  const mocSurveyService = useMocSurvey();

  if (!mocSurveyService.self && !mocSurveyService.mocSurveyList) return <></>;
  return (
    <Container filter={mocSurveyService.filter}>
      <Survey.Button
        className="all-button"
        backgroundColor="#a0e3ff"
        filter={mocSurveyService.filter}
        onClick={() => mocSurveyService.changeFilter("all")}
      >
        {mocSurveyService.filter === "all" && <CheckIcon />}
        {`All(${mocSurveyService.allCount})`}
      </Survey.Button>
      <Survey.Button
        className="active-button"
        backgroundColor="#ffe177"
        filter={mocSurveyService.filter}
        onClick={() => mocSurveyService.changeFilter("active")}
      >
        {mocSurveyService.filter === "active" && <CheckIcon />}
        {`Active(${mocSurveyService.activeCount})`}
      </Survey.Button>
    </Container>
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
