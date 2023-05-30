"use client";
import { AiOutlineDown } from "react-icons/ai";
import { Dropdown } from "@shared/client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const MarketNav = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menu = searchParams && (searchParams.get("menu") as "goods" | "nfts");
  const subMenu =
    searchParams &&
    (searchParams.get("subMenu") as
      | "all"
      | "gifticon"
      | "skinp2p"
      | "raffle"
      | "mossmarket"
      | "p2p"
      | "MyTokens"
      | "cyberthug");
  const goods = [
    {
      key: "1",
      label: <div className={`text-center ${subMenu === "cyberthug" && "font-bold"}`}>CyberTHUG</div>,
      onClick: () => router.push("/listing?menu=goods&subMenu=cyberthug"),
    },
    {
      key: "2",
      label: <div className={`text-center ${subMenu === "gifticon" && "font-bold"}`}>Gifticon</div>,
      onClick: () => router.push("/listing?menu=goods&subMenu=gifticon"),
    },
    {
      key: "3",
      label: <div className={`text-center ${subMenu === "skinp2p" && "font-bold"}`}>Skin P2P</div>,
      onClick: () => router.push("/trade?menu=goods&subMenu=skinp2p"),
    },
    {
      key: "4",
      label: <div className={`text-center ${subMenu === "raffle" && "font-bold"}`}>Raffle</div>,
      onClick: () => router.push("/raffle?menu=goods&subMenu=raffle"),
    },
  ];
  const nfts = [
    {
      key: "1",
      label: <div className={`text-center ${(!subMenu || subMenu === "all") && "font-bold"}`}>ALL</div>,
      onClick: () => router.push("/listing?menu=nfts&subMenu=all"),
    },
    {
      key: "2",
      label: <div className={`text-center ${subMenu === "mossmarket" && "font-bold"}`}>MossMarket</div>,
      onClick: () => router.push("/listing?menu=nfts&subMenu=mossmarket"),
    },
    {
      key: "3",
      label: <div className={`text-center ${subMenu === "p2p" && "font-bold"}`}>P2P</div>,
      onClick: () => router.push("/listing?menu=nfts&subMenu=p2p"),
    },
  ];

  return (
    <div className="flex items-center justify-center border-y-[2px] border-solid border-[#000]">
      <div className="flex w-full ">
        <Dropdown
          buttonClassName="btn-ghost h-10 min-h-10"
          dropdownClassName="w-full "
          className="flex-grow "
          value={
            <div className="flex items-center justify-center ">
              <div className={`mr-2 text-[22px] text-black ${menu === "goods" && "font-bold"}`}>GOODS</div>
              <AiOutlineDown />
            </div>
          }
          content={goods.map((item) => (
            <div key={item.key} onClick={item.onClick} className="w-full btn btn-ghost btn-sm">
              {item.label}
            </div>
          ))}
        />
        <Dropdown
          buttonClassName="btn-ghost h-10 min-h-10"
          className="flex-grow"
          dropdownClassName="w-full"
          value={
            <div className="flex items-center justify-center ">
              <div className={`mr-2 text-[22px] text-black ${(!menu || menu === "nfts") && "font-bold"}`}>NFT</div>
              <AiOutlineDown />
            </div>
          }
          content={nfts.map((item) => (
            <div key={item.key} onClick={item.onClick} className="w-full btn btn-ghost btn-sm">
              {item.label}
            </div>
          ))}
        />
      </div>
    </div>
  );
};
