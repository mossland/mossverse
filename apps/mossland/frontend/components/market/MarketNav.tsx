import React, { useEffect } from "react";
import { gql, st, store } from "../../stores";
import { Navigator } from "@shared/ui-web";
import { Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export const MarketNav = () => {
  const router = useRouter();
  const menu = router.query.menu as "goods" | "nfts";
  const subMenu = router.query.subMenu as
    | "all"
    | "gifticon"
    | "skinp2p"
    | "raffle"
    | "mossmarket"
    | "p2p"
    | "MyTokens"
    | "cyberthug";
  const goods: MenuProps["items"] = [
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
  const nfts: MenuProps["items"] = [
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
    <Navigator>
      {
        <>
          <Dropdown menu={{ items: goods }} className="w-full ">
            <a onClick={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center flex-1">
                  <div className={`mr-2 text-[22px] text-black ${menu === "goods" && "font-bold"}`}>GOODS</div>
                  <DownOutlined />
                </div>
              </div>
            </a>
          </Dropdown>
          <Dropdown menu={{ items: nfts }} className="w-full">
            <a onClick={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center flex-1">
                  <div className={`mr-2 text-[22px] text-black ${(!menu || menu === "nfts") && "font-bold"}`}>NFT</div>
                  <DownOutlined />
                </div>
              </div>
            </a>
          </Dropdown>
        </>
      }
    </Navigator>
  );
};
