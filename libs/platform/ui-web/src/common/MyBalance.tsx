import React, { useEffect } from "react";
import { MyBalanceInfo } from "@platform/ui-web";
import styled from "styled-components";
import { gql, utils, store } from "@platform/data-access";
import { Utils } from "@shared/util";
import { Props } from "@shared/ui-web";

export const Balance = (props: Props.BaseProps) => {
  return <div className="mt-[6px] w-full">{props.children}</div>;
};

const Item = (props: Props.BaseProps) => {
  return <div className="flex items-center justify-between">{props.children}</div>;
};

const Label = (props: Props.BaseProps) => {
  return <div className="text-base font-bold text-gray-600">{props.children}</div>;
};

const Image = (props: Props.ImageProps) => {
  return <img src={props.src} className="inline-block mt-[-2px] w-[16px] mr-[4px]" />;
};

const Num = (props: Props.BaseProps) => {
  return <div className="text-[22px]">{props.children}</div>;
};

Balance.Item = Item;
Balance.Label = Label;
Balance.Image = Image;
Balance.Num = Num;

type MyBalanceProps = {
  things: string[];
};

export const MyBalance = (props: MyBalanceProps) => {
  const self = store.user.use.self();
  const balancies = self && gql.User.getThings(self, props.things);

  useEffect(() => {
    if (!self?.keyring) return;
  }, [self?.keyring]);

  return (
    <Balance>
      {balancies &&
        balancies.map((balance, index) => (
          <Balance.Item>
            <Balance.Label>
              <Balance.Image src={balance.thing.image.url} />
              {balance.thing.name ?? "MMOC"}
            </Balance.Label>
            <Balance.Num>{balance.num ? Utils.numberWithCommas(balance.num) : 0}</Balance.Num>
          </Balance.Item>
        ))}
    </Balance>
  );
};
