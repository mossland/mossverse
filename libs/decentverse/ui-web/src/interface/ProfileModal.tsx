import { store, gql } from "@decentverse/data-access";
import styled, { keyframes } from "styled-components";
import { WalletList, ProfileNameEditForm } from ".";
import { ModalContainer } from "@shared/ui-web";
import { BiEdit } from "react-icons/bi";

export type MyProfileProps = {
  // socket: Soc;
};

export const ProfileModal = () => {
  const user = store.user.use.user();
  const self = store.user.use.self();
  const render = store.world.use.me();
  const isPossibleEdit = store.user.use.isPossibleEdit();
  const isProfileNameEdit = store.user.use.isProfileNameEdit();

  const closeProfile = () => store.user.setState({ user: null, isPossibleEdit: false });
  const isMe = () => user?.id === self?.id;
  if (!user) return <></>;

  return (
    <ModalWrapper>
      <ModalContainer showModal={!!user} closeShowModal={closeProfile} title="Character" opacity="0.9">
        <ProfileContainer>
          <div className="character">
            <div className="image-wrapper">
              <img src={render?.character?.file?.url ?? ""} />
            </div>
          </div>
          <div className="infomation-contaner">
            <div className="playerInfo">
              {isProfileNameEdit ? (
                <ProfileNameEditForm />
              ) : (
                <div className="name">
                  {render.nickname}
                  {isMe() && user.role !== "guest" && (
                    <div className="name-button" onClick={() => store.user.setState({ isProfileNameEdit: true })}>
                      <BiEdit />
                    </div>
                  )}
                </div>
              )}
              {/* <div className="desc">
              <span className="label">type:</span>
              {user.role}
            </div> */}
              {isPossibleEdit && isMe() && user.role !== "guest" && <WalletList />}
            </div>
          </div>
        </ProfileContainer>
      </ModalContainer>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  .modal {
    min-width: auto;
    min-height: auto;
    width: 406px;
    height: 275px;
    @media screen and (max-width: 800px) {
      width: 90%;
      min-width: auto;
    }
  }
`;

const ProfileContainer = styled.div`
  border-radius: 5;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  height: 100%;
  align-items: flex-start;
  display: flex;
  gap: 30px;
  padding: 0 20px;

  .image-wrapper {
    position: relative;
    width: 116px;
    height: 191px;
    overflow: hidden;
    background-color: #c3c3c4;
    margin-top: 23px;
    border-radius: 8px;
    img {
      margin-top: -12px;
      margin-left: 12px;
      width: 150%;
      image-rendering: pixelated;
      -webkit-user-drag: none;
    }
  }

  .infomation-contaner {
    padding-top: 40px;
    .name {
      font-size: 26px;
      line-height: 1.2em;
      .name-button {
        display: inline-block;
        margin-left: 4px;
        margin-bottom: -6px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          opacity: 0.6;
        }
      }
    }
    .desc {
      font-weight: normal;
      font-size: 22px;
    }
    .label {
      font-weight: bold;
    }
  }
`;
