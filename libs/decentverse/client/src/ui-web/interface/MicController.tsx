import { MicOnIcon, MicOffIcon } from "..";
import { callRoomStore } from "../../stores";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

export const MicController = () => {
  const callBox = callRoomStore.use.callRoom();
  const setMic = callRoomStore.use.setMic();
  const toggleMyMic = async () => {
    if (callBox.forceMute) return;
    const mic = callBox.mic ? 0 : 100;
    setMic(mic);
  };
  return (
    <Container>
      {!isMobile && callBox?.roomType !== "video" && callBox.roomId && (
        <Control>
          <IconButton onClick={toggleMyMic}>
            {!callBox.forceMute && callBox.mic ? <MicOnIcon /> : <MicOffIcon />}
            {callBox.forceMute && <div>you muted</div>}
          </IconButton>
        </Control>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: 90px;
  left: 50%;
  z-index: 10;
  /* border-width: 10px; */
`;

const Control = styled.div`
  bottom: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
  transform: translate(-50%, 0);
`;
const MobileControl = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
  /* transform: translate(-50%, 0); */
`;

const IconButton = styled.button`
  background: white;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
`;
