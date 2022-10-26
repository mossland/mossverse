import { Utils } from "@shared/util";
import styled from "styled-components";

type PeriodProps = {
  openAt: Date;
  closeAt: Date;
};
export const Period = ({ openAt, closeAt }: PeriodProps) => {
  return (
    <Container className="period">
      {Utils.toIsoString(openAt, true)} ~ {Utils.toIsoString(closeAt, true)}
    </Container>
  );
};

const Container = styled.div`
  font-family: Ubuntu Mono;
  text-align: end;
  font-style: normal;
  justify-content: flex-end;
  /* font-weight: 400; */
  font-size: 16px;
  line-height: 16px;
`;
