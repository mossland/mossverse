import React from "react";
import styled from "styled-components";
import { Utils } from "@shared/util";
import { VotingTag, Period, ActiveTag, MyVoteTag, MyDaoTag, ClosedTag } from "./";
import { SurveyIcon } from "@shared/ui-web";

type SurveyItemProps = {
  title: string;
  selected: boolean;
  myDao: boolean;
  openAt: Date;
  closeAt: Date;
  voted: boolean;
  opened: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

export const Item = ({ title, selected, voted, opened, closeAt, openAt, onClick }: SurveyItemProps) => {
  return (
    <SurveyItemContainer onClick={onClick} selected={selected} voted={!opened || voted}>
      <div className="title-container">
        <SurveyIcon />
        <div className="title">{title}</div>
        {/* <div className="title">{title}</div> */}
      </div>
      <div className={"sub-title-container"}>
        {opened && new Date(closeAt).getTime() > Date.now() && <ActiveTag />}
        {/* {status === "opened" && <VotingTag />} */}
        {/* {myDao && <MyDaoTag />} */}
        {/* {voted && <MyVoteTag />} */}
        {/* {survey.status === "closed" && <ClosedTag />} */}
        <Period openAt={openAt} closeAt={closeAt} />
      </div>
    </SurveyItemContainer>
  );
};

const SurveyItemContainer = styled.div<{ selected: boolean; voted: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 18px;
  height: 92px;
  width: 100%;
  border: 0px;
  border-top: 2px solid;
  border-bottom: 2px solid;
  background-color: ${(props) => (props.voted ? "#E8E8E8" : "#fff")};
  border-color: ${(props) => (props.selected ? `${props.theme.color.black}` : `${props.theme.color.grayD}`)};
  z-index: ${(props) => (!props.voted && props.selected ? 0.6 : 0)};

  transition-duration: 0.5s;

  position: relative;
  margin-top: -2px;

  .title-container {
    display: flex;
    .title {
      margin-left: 8px;
      font-family: Ubuntu Mono;
      text-align: left;
      font-style: normal;
      font-size: 16px;
      line-height: 16px;
      font-weight: ${(props) => (!props.voted && props.selected ? 700 : 400)};
      color: ${(props) => (!props.voted && props.selected ? "#000" : "#555")};

      /* margin-bottom: 30px; */
    }
  }
  .sub-title-container {
    display: flex;
    align-items: self-end;
    .tag {
      margin-bottom: -2px;
    }
  }
  .period {
    font-weight: ${(props) => (!props.voted && props.selected ? 700 : 400)};
  }
  :hover {
    background-color: #f4f4f4;
  }
  cursor: pointer;
`;
