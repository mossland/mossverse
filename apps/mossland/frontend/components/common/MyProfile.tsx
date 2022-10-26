import React from "react";
import { userStore, useUser } from "@platform/data-access";
import { MyBalanceInfo } from "@platform/ui-web";
import styled from "styled-components";
import { walletStore } from "@shared/data-access";
import { Title } from "./Title";

type MyProfileProps = {
  nickname: string;
};

export const MyProfile = ({ nickname }: MyProfileProps) => {
  // const address = useUser((state) => state.address);
  const self = userStore.use.self();
  const wallet = walletStore.use.wallet();

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
