import styled from "styled-components";
import { store, gql, utils } from "@decentverse/data-access";
import { Socket as Soc } from "socket.io-client";
import { Button, Popover } from "antd";
import { InfoIcon } from "@shared/ui-web";

type ItemProps = {
  socket: Soc;
  item: gql.MyItem;
  num: number;
  index: number;
};
export const Item = ({ socket, item, num, index }: ItemProps) => {
  const self = store.user.use.self();
  const myItem = store.user.use.myItem();
  const selectedItemIndex = store.user.use.selectedItemIndex();
  const toggleItemMenu = () => {
    if (selectedItemIndex !== null) {
      store.user.setState({
        selectedItemIndex: null,
      });
    } else {
      store.user.setState({
        selectedItemIndex: index,
      });
    }
  };
  const openInfo = () =>
    store.user.setState({
      myItem: item,
      selectedItemIndex: null,
    });

  if (!self) return null;

  return (
    <ItemContainer>
      <Popover
        open={selectedItemIndex === index}
        onVisibleChange={toggleItemMenu}
        trigger="click"
        content={
          <Menu>
            <Button type="text" onClick={openInfo} className="menu-item">
              <InfoIcon />
              Info
            </Button>
          </Menu>
        }
        placement="left"
      >
        <div className="item">
          {utils.getMyItemImage(item) ? (
            <img src={utils.getMyItemImage(item)}></img>
          ) : (
            <div className="empty-image">no image</div>
          )}
        </div>
        {num > 1 && <div className="num">{num}</div>}
      </Popover>{" "}
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  position: relative;
  width: 93px;
  height: 93px;
  margin-top: -2px;
  padding: 0px;

  /* margin: 1px; */
  /* border-radius: 5px; */
  /* border-width: 1px; */
  /* border-color: rgba(255, 255, 255, 0.4); */
  cursor: pointer;

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

  .item {
    width: 94px;
    height: 94px;
    /* margin-left: 7px; */
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 90%;
      height: 90%;
    }
  }

  .num {
    color: white;
    font-size: 10px;
    position: absolute;
    border-radius: 100px;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.4);
    padding-left: 6px;
    padding-right: 6px;
  }

  .empty-image {
    background: white;
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 800px) {
    width: 90px;
    height: 90px;
    .item {
      width: 90px;
      height: 90px;
      margin-left: 0px;
      padding: 6px;
    }
  }
`;

const Menu = styled.div`
  .menu-item {
    color: #777777;
    /* padding: 4px; */
    svg {
      display: inline;
      vertical-align: sub;
      margin-right: 6px;
    }

    &:hover {
      background-color: #23fae6;
      color: #000;
    }
  }
`;
