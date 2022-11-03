import { store, gql } from "@decentverse/data-access";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { darken } from "polished";
import { ProfileModal } from "./";

export type MyProfileButtonProps = {
  // socket: Soc;
};

export const MyProfileButton = () => {
  const self = store.user.use.self();
  const user = store.user.use.user();
  const me = store.world.use.me();

  const openProfile = () => store.user.setState({ user: self, isPossibleEdit: true });
  return (
    <>
      <ProfileButton onClick={openProfile} style={{ opacity: user ? 0.7 : 1 }}>
        <img src={me.character.file.url} />
        <div className="underline" />
      </ProfileButton>
    </>
  );
};

const ProfileButton = styled.div`
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  z-index: 1;
  margin-left: 4px;
  margin-right: 10px;
  height: 60px;
  width: 60px;
  overflow: hidden;
  border: 3px solid #000;
  position: relative;
  .underline {
    background-color: white;
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  img {
    margin: -10px;
    width: 240%;
    image-rendering: pixelated;
    -webkit-user-drag: none;
  }
  &:hover,
  &:hover .underline {
    background-color: ${darken(0.2, "white")};
    transition: 0.5s;
  }
`;
