import React, { useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { Item, ItemInfo } from "./";
import { Socket as Soc } from "socket.io-client";
import { darken } from "polished";
import { WindowHeader, InventoryIcon } from "@shared/ui-web";
import { Col, Row } from "antd";

export type InventoryProps = {
  socket: Soc;
};

export const Inventory = ({ socket }: InventoryProps) => {
  const initMyItems = store.user.use.initMyItems();
  const myItems = store.user.use.myItems();
  const isInventoryOpen = store.user.use.isInventoryOpen();
  const self = store.user.use.self();
  const openInventory = () => store.user.setState({ isInventoryOpen: true });
  const closeInventory = () => store.user.setState({ isInventoryOpen: false });

  if (!self) return <></>;

  // const toggleInventory = async () => {
  //   !isOpenInventory && self.role !== "guest" && (await syncInventory(self.id));
  //   toggleOpenInventory();
  // };
  return (
    <div>
      {!isInventoryOpen ? (
        <InventoryButton onClick={openInventory} style={{ opacity: myItems.length ? 0.7 : 1 }}>
          <InventoryIcon />
        </InventoryButton>
      ) : (
        <InventoryContainer>
          <WindowHeader title="INVENTORY" type="reduce" close={closeInventory} />

          <div className="body">
            {/* <div
              style={{
                zIndex: 2,
                display: "flex",
                flexWrap: "wrap",
                borderRadius: 5,
              }}
            > */}
            <Row gutter={0}>
              {myItems.map((item, index) => (
                <Col key={index} xs={{ span: 8 }} md={{ span: 6 }}>
                  <Item socket={socket} item={item} num={item.num} index={index} />
                </Col>
              ))}
              {Array(16 - myItems.length > 0 ? 16 - myItems.length : 4 - (myItems.length % 4))
                .fill("")
                .map((a, index) => (
                  <Col key={index} xs={{ span: 8 }} md={{ span: 6 }}>
                    <div className="empty" />
                  </Col>
                ))}
            </Row>
          </div>
          {/* </div> */}
          {/* <ItemInfo /> */}
        </InventoryContainer>
      )}
    </div>
  );
};

const inventoryAni = keyframes`
  0% {
    transform: scale(0, 0);
    width:0px;
    opacity: 0.4;
  }
  100% {
    transform: scale(1, 1);
    width: 398px;
    opacity: 1;
  }
`;

const InventoryButton = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 12px 11px;
  cursor: pointer;
  transition: 0.5s;
  margin-right: 10px;
  z-index: 1;
  margin-left: 4px;
  border: 3px solid #000;

  svg {
    margin: 0;
    font-size: 26px;
  }
  &:hover {
    background-color: ${darken(0.2, "white")};
  }
`;

const InventoryContainer = styled.div`
  z-index: 3;
  border: 3px solid #000;
  border-radius: 10px;
  margin-right: 10px;
  transform-origin: right top;
  animation: ${inventoryAni} 0.3s ease-in-out forwards;
  overflow-x: hidden;

  @media screen and (max-width: 800px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: none;
  }

  .body {
    z-index: 2;
    width: 100%;
    /* width: 398px; */
    height: 394px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 5;
    /* display: flex; */
    /* flex-direction: column; */
    align-content: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    padding: 14px;
    /* padding: 13px; */
    @media screen and (max-width: 800px) {
      width: 293px;
      height: 330px;
    }
  }
  .empty {
    width: 93px;
    height: 93px;
    margin-top: -2px;
    background: linear-gradient(to right, #848484 2px, transparent 2px) 0 0,
      linear-gradient(to right, #848484 2px, transparent 2px) 0 100%,
      linear-gradient(to left, #848484 2px, transparent 2px) 100% 0,
      linear-gradient(to left, #848484 2px, transparent 2px) 100% 100%,
      linear-gradient(to bottom, #848484 2px, transparent 2px) 0 0,
      linear-gradient(to bottom, #848484 2px, transparent 2px) 100% 0,
      linear-gradient(to top, #848484 2px, transparent 2px) 0 100%,
      linear-gradient(to top, #848484 2px, transparent 2px) 100% 100%;

    background-repeat: no-repeat;
    background-size: 8px 8px;

    @media screen and (max-width: 800px) {
      width: 90px;
      height: 90px;
    }
  }
`;
