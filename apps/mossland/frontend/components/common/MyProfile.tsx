import React from "react";
import styled from "styled-components";

type MyProfileProps = {
  nickname: string;
};

export const MyProfile = ({ nickname }: MyProfileProps) => {
  return (
    <StyledMyProfile>
      <div className="nickname">
        <span>Nickname:</span>
        {nickname}
      </div>
    </StyledMyProfile>
  );
};

const StyledMyProfile = styled.div`
  margin-bottom: 10px;
  .nickname {
    background-color: #e8e8e8;
    padding: 5px 10px;
    border-radius: 4px;
    /* overflow: hidden; // 을 사용해 영역을 감출 것
    text-overflow: ellipsis; // 로 ... 을 만들기
    white-space: nowrap; // 아래줄로 내려가는 것을 막기위해 */
    span {
      font-weight: bold;
      margin-right: 7px;
    }
  }
`;
