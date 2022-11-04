import { store, gql, utils } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { WindowHeader } from "@shared/ui-web";

export const ItemInfo = () => {
  const myItem = store.user.use.myItem();
  const closeItem = () => store.user.setState({ myItem: null });

  if (!myItem) return null;

  return (
    <ItemInfoContainer>
      <WindowHeader title={utils.getMyItemName(myItem)} close={closeItem} />
      <div className="body">
        <div className="left">
          <img src={utils.getMyItemImage(myItem)} />
        </div>
        <div className="right">
          <p>
            <span>Qty:</span>
            {myItem.num}
          </p>
          {myItem.type === "token" && (
            <div>
              <p className="contract-label">CONTRACT</p>
              <p>
                <span>chain:</span>
                {myItem.token?.contract.network.provider}
              </p>
              <p>
                <span>Address:</span>
                {myItem.token?.contract.address}
              </p>
              <p>
                <span>type:</span>
                {myItem.token?.contract.interface}
              </p>
              <p>
                <span>tokenid:</span>
                {myItem.token?.tokenId}
              </p>
            </div>
          )}
        </div>
      </div>
    </ItemInfoContainer>
  );
};

const ItemAni = keyframes`
  0% {
    transform: scale(0, 0);
    opacity: 0.4;
  }
  100% {
    transform: scale(1, 1);
    opacity: 1;
  }
`;

const ItemInfoContainer = styled.div`
  z-index: 3;
  border: 3px solid #000;
  border-radius: 10px;
  transform-origin: right top;
  /* animation: ${ItemAni} 0.3s ease-in-out forwards; */
  width: 509px;
  height: 272px;

  overflow: hidden;
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  .body {
    height: 239px;
    display: flex;
    .left {
      padding: 30px;
      img {
        max-width: 164px;
        max-height: 164px;
      }
    }
    .right {
      flex: 1;
      flex-direction: column;
      padding: 25px 25px 25px 0;
      .contract-label {
        font-weight: bold;
        margin-top: 10px;
      }
      p {
        font-size: 22px;
        overflow-wrap: anywhere;
        line-height: 1.1em;
        span {
          font-weight: bold;
        }
      }
    }
  }
  @media screen and (max-width: 800px) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: none;
    z-index: 20;
    width: 100vw;
  }
`;
