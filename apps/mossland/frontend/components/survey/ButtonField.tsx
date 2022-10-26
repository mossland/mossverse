import { surveys, userStore, checkIsActiveSurvey } from "@platform/data-access";
import { Survey } from "@platform/ui-web";
import styled from "styled-components";
import { cnst } from "@shared/util";
import { walletStore } from "@shared/data-access";
import { mocSurveyStore } from "apps/mossland/frontend/stores";
export const ButtonField = () => {
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();
  const filter = mocSurveyStore.use.filter();
  const mocSurveys = mocSurveyStore.use.mocSurveys();
  if (!self && !mocSurveys) return <></>;
  const allCount = mocSurveyStore.use
    .mocSurveys()
    .filter((survey) => ["opened", "closed"].includes(survey.status)).length;
  const activeCount = mocSurveyStore.use
    .mocSurveys()
    .filter((mocSurvey) => checkIsActiveSurvey(mocSurvey.status, mocSurvey.closeAt)).length;

  const onClickFilter = (value: cnst.SurveyFilterTypes) => {
    mocSurveyStore.setState({ filter: value });
  };

  return (
    <Container>
      <Survey.SortButton active={filter === "all"} onClick={() => onClickFilter("all")} backgroundColor={"#A0E3FF"}>
        <ButtonText>{`All(${allCount})`}</ButtonText>
      </Survey.SortButton>
      <Survey.SortButton
        active={filter === "active"}
        onClick={() => onClickFilter("active")}
        backgroundColor={"#FFE177"}
      >
        <ButtonText>{`Active(${activeCount})`}</ButtonText>
      </Survey.SortButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: absolute;
  bottom: 14px;
`;

const ButtonText = styled.div`
  margin-left: 5px;
  text-align: center;
  font-size: 14px;
`;
