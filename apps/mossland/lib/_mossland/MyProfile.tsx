"use client";
import React from "react";

type MyProfileProps = {
  nickname: string;
};

export const MyProfile = ({ nickname }: MyProfileProps) => {
  return (
    <div className="mb-[10px]">
      <div className="bg-[#e8e8e8] py-[5px] px-[10px] rounded-[4px]">
        <span className="font-bold mr-[7px]">Nickname:</span>
        {nickname}
      </div>
    </div>
  );
};
