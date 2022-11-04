import { Socket as Soc } from "socket.io-client";
import { store, gql } from "@decentverse/data-access";
import { CallBox, MyCall } from "./";
import { VideoBox, MyVideo } from "./video";
import styled from "styled-components";

export interface StreamProps {
  socket: Soc;
}

export const Stream = ({ socket }: StreamProps) => {
  const callBox = store.callRoom.use.callRoom();

  return (
    <Containter>
      {callBox.roomId &&
        (callBox.roomType === "video" ? (
          // (true ? (
          <>
            <MyVideo socket={socket} roomId={callBox.roomId} />
            {callBox.localStream?.getVideoTracks().length && (
              <VideoBox
                localStream={callBox.localStream}
                screenStream={callBox.screenStream}
                roomId={callBox.roomId}
                socket={socket}
              />
            )}
          </>
        ) : (
          <>
            <MyCall socket={socket} roomId={callBox.roomId} />
            {callBox.localStream?.getAudioTracks().length && (
              <CallBox
                localStream={callBox.localStream}
                screenStream={callBox.screenStream}
                roomId={callBox.roomId}
                socket={socket}
              />
            )}
          </>
        ))}
    </Containter>
  );
};

const Containter = styled.div`
  z-index: 1;
  /* position: absolute;
  top: 0px;
  right: 0px;
  width: 0px;
  height: 0px; */
`;
