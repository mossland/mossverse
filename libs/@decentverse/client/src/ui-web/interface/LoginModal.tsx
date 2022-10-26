import styled from "styled-components";
import { types, userStore, characterStore, worldStore, mapStore, callRoomStore } from "../../stores";
import { CharacterBox } from "..";
import { useKeyring, keyringStore } from "@shared/data-access";
import { ModalContainer } from "@shared/ui-web";
import { darken } from "polished";

export const LoginModal = () => {
  const self = userStore.use.self();
  const nickname = userStore.use.nickname();
  const me = worldStore.use.me();
  const character = characterStore.use.character();
  const loginMethod = keyringStore.use.loginMethod();
  const isShowVideoAudioSetting = userStore.use.isShowVideoAudioSetting();

  const reset = userStore.use.reset();
  const changeLoginMethod = (loginMethod: types.shared.LoginMethod) => useKeyring.setState({ loginMethod });
  const updateUser = userStore.use.update();

  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => e.key === "Enter" && onClickSubmit();
  const setNickname = (nickname: string) => userStore.setState({ nickname });

  const onClickSubmit = async () => {
    if (!character || !nickname) return;
    if (self && self?.role !== "guest") await updateUser();
    worldStore.setState({ me: { ...me, nickname, character } });
    // keyringStore.setState({ loginMethod: "none" });
    userStore.setState({ isShowVideoAudioSetting: true });
  };
  const goBack = async () => {
    reset();
    changeLoginMethod("none");
  };

  return (
    <ModalContainer
      showModal={loginMethod !== "none" && !isShowVideoAudioSetting}
      closeShowModal={goBack}
      title="Select Your Character"
    >
      <CharacterBox type="guest" />
      <InputBox onKeyPress={keyPress}>
        {
          <input
            autoFocus
            placeholder="Type your nickname!"
            disabled={self?.role === "guest" || self?.nickname?.toLowerCase() !== "default nickname"}
            value={nickname ?? ""}
            onChange={(e: any) => setNickname(e.target.value)}
          />
        }
        <Submit onClick={onClickSubmit}>Next</Submit>
      </InputBox>
    </ModalContainer>
  );
};

const InputBox = styled.div`
  padding: 0 22px;
  input {
    background-color: rgba(255, 255, 255, 0.7);
    border: 2px solid #000;
    font-size: 22px;
    width: 100%;
    border-radius: 10px;
    padding: 7px 14px;
    &:focus {
      outline-width: 0;
    }
    &:disabled {
      opacity: 0.3;
    }
  }
`;

const Submit = styled.div`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 22px 0;
  font-size: 22px;
  color: #000;
  background-color: #66fef0;
  text-align: center;
  border-radius: 10px;
  transition: 0.5s;
  border: 2px solid #000;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.3, "#66fef0")};
  }
`;
