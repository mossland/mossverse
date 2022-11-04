import { store, gql } from "@decentverse/data-access";
import { MicOnIcon, MicOffIcon, InteractionIcon } from "..";
import { Joystick } from "react-joystick-component";
import { isMobile, isIOS } from "react-device-detect";
import styled from "styled-components";

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
  distance: number | null;
}

export const MobileController = () => {
  const screen = store.game.use.screen();
  const callBox = store.callRoom.use.callRoom();
  const webview = store.webview.use.webview();
  const callRoom = store.callRoom.use.CALLROOM();
  const setKey = store.game.use.setKey();
  const setMic = store.callRoom.use.setMic();

  const handleMove = (event: IJoystickUpdateEvent) => {
    if (event.x && event.x > screen.size[0] / 2 / 10) {
      setKey("right", true);
      setKey("left", false);
    } else if (event.x && event.x < -(screen.size[0] / 2) / 10) {
      setKey("right", false);
      setKey("left", true);
    } else {
      setKey("right", false);
      setKey("left", false);
    }

    //top
    if (event.y && event.y > screen.size[0] / 2 / 10) {
      setKey("down", false);
      setKey("up", true);
    } else if (event.y && event.y < -(screen.size[0] / 2) / 10) {
      setKey("down", true);
      setKey("up", false);
    } else {
      setKey("down", false);
      setKey("up", false);
    }
  };
  const handleStop = (event: IJoystickUpdateEvent) => {
    setKey("down", false);
    setKey("up", false);
    setKey("left", false);
    setKey("right", false);
  };

  const toggleMyMic = async () => {
    const mic = callBox.mic ? 0 : 100;
    setMic(mic);
  };

  const enableInteraction = () => {
    store.webview.setState({ webviewOpen: true });
    setKey("interaction", true);
  };
  const disableItneraction = () => setKey("interaction", false);

  if (!isMobile) return <></>;
  return (
    <Container width={screen.size[0]}>
      <Joystick
        size={screen.size[0] / 5}
        baseColor="rgba(101,101,101,0.85)"
        stickColor="#adadad"
        move={handleMove}
        stop={handleStop}
      />
      <ButtonContainer>
        {callRoom && (
          <Control>
            <IconButton width={screen.size[0]} onClick={toggleMyMic}>
              {callBox.mic ? <MicOnIcon /> : <MicOffIcon />}
            </IconButton>
          </Control>
        )}
        {webview && (
          <InteractionButton width={screen.size[0]} onTouchStart={enableInteraction} onTouchEnd={disableItneraction}>
            <InteractionIcon />
          </InteractionButton>
        )}
      </ButtonContainer>
    </Container>
  );
};

const Container = styled("div")<{ width: number }>`
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 25px;
  padding-left: ${(props) => props.width / 9}px;
  /* left: 10%; */
  bottom: 15%;
  z-index: 1;
`;

const ButtonContainer = styled.button`
  display: flex;
  background-color: transparent;
  border-width: 0;
  z-index: 3;
`;
const InteractionButton = styled("button")<{ width: number }>`
  width: ${(props) => props.width / 7}px;
  height: ${(props) => props.width / 7}px;
  border-radius: 300px;
  margin-left: 20px;
  display: flex;
  border-width: 0;
  justify-content: center;
  align-items: center;
  background-color: white;
`;
const Control = styled.div`
  display: flex;
  border-width: 0;
  justify-content: center;
`;

const IconButton = styled("button")<{ width: number }>`
  background: white;
  width: ${(props) => props.width / 7}px;
  height: ${(props) => props.width / 7}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
`;
