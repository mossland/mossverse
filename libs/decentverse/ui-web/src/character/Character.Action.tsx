import { createTileTextureAnimator, gql, loader, slice, st, useSprite } from "@decentverse/data-access";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { LoadItems, ModalContainer } from "@shared/ui-web";
import { client, useInterval } from "@shared/util-client";
import { Joystick } from "react-joystick-component";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { NearestFilter, Sprite, Texture } from "three";
import { Character } from "..";
interface SelectPlayerCharacterProps {
  slice?: slice.CharacterSlice;
  self?: gql.User;
}
export const SelectPlayerCharacter = ({ slice = st.slice.character, self }: SelectPlayerCharacterProps) => {
  const playerType = st.use.playerType();
  const playerNickname = st.use.playerNickname();
  const [select, setSelect] = useState<gql.LightCharacter>();
  return (
    <ModalContainer
      showModal={!!playerType}
      closeShowModal={() => st.do.setPlayerType(null)}
      title="Select Your Character"
    >
      <LoadItems
        className="flex justify-center gap-4 my-4"
        slice={slice}
        init={{ query: { status: "approved", name: "default" } }}
        renderItem={(character: gql.LightCharacter, idx) => (
          <Character.Item.Abstract
            className={character.id === select?.id ? "border-[#fff]" : "border-[#555]"}
            key={character.id}
            character={character}
            idx={idx}
            onClick={() => setSelect(character)}
          />
        )}
        onLoad={(characterList) => setSelect(characterList[0])}
      />
      <div className="h-auto">
        <div className="relative w-[100px] h-[260px] overflow-hidden my-0 mx-auto">
          {select?.file.url && (
            <Image
              className="absolute  scale-[1.8] left-[-5px] top-[-15px] origin-top-left"
              src={select.file.url}
              width={select.file.imageSize[0]}
              height={select.file.imageSize[1]}
              style={{ imageRendering: "pixelated" }}
              alt="character"
            />
          )}
        </div>
      </div>
      <div
        // onKeyPress={keyPress}
        className="px-[22px]"
      >
        <input
          autoFocus
          placeholder="Type your nickname!"
          value={playerNickname}
          onChange={(e) => st.do.setPlayerNickname(e.target.value)}
          className="bg-white/70 py-[7px] px-[14px] focus:outline-none disabled:opacity-30 rounded-[10px] border-[2px] border-black text-[22px] w-full"
        />
        <button
          onClick={() => select && st.do.setPlayerCharacter(select)}
          disabled={!playerNickname.length || !select}
          className="border-[2px] border-black cursor-pointer rounded-[10px] block w-full p-[10px] my-[22px] text-[22px] text-black bg-[#66fef0] hover:bg-[#66fef0]/80 transition duration-500"
        >
          Next
        </button>
      </div>
    </ModalContainer>
  );
};

interface PlayerWorldStatusProps {
  playerCharacter?: gql.LightCharacter;
  playerChatText?: string;
  playerStatus?: "talk" | null;
  playerEmojiUrl?: string | null;
  playerNickname?: string;
}

export const PlayerWorldStatus = ({
  playerCharacter = st.use.playerCharacter(),
  playerChatText = st.use.playerChatText(),
  playerStatus = st.use.playerStatus(),
  playerEmojiUrl = st.use.playerEmojiUrl(),
  playerNickname = st.use.playerNickname(),
}: PlayerWorldStatusProps) => {
  return (
    <>
      <Html
        center
        zIndexRange={[100]}
        style={{
          lineHeight: "1.2em",
          fontSize: "22px",
          color: "#DFDFDF",
          marginTop: "100px",
          marginLeft: "1px",
          textAlign: "center",
          whiteSpace: "nowrap",
          zIndex: 1,
        }}
      >
        {playerNickname}
      </Html>
      {(playerChatText.length || playerStatus) && (
        <Html
          center
          zIndexRange={[100]}
          // position={[1, playerSize[1] * 0.7, 1]}
          style={{
            // backgroundColor: `rgba(255,255,255,${chatText.length ? 0.7 : 0})`,
            backgroundColor: "white",
            maxWidth: 220,
            width: "max-content",
            borderRadius: 10,
            bottom: isMobile ? 10 : 50,
            padding: "8px 10px",
            lineHeight: "1.2em",
            alignContent: "center",
            alignItems: "center",
            wordWrap: "break-word",
            boxShadow: "0px 4px 4px 0px #00000040",
            marginBottom: "24px",
            fontSize: "16px",
            zIndex: 1,
          }}
        >
          {playerChatText.length ? (
            playerChatText
          ) : playerStatus === "talk" ? (
            <img alt="emoji" style={{ zIndex: 1 }} src={"/speechBubble.png"} width="65px" />
          ) : null}
        </Html>
      )}
      {playerEmojiUrl && (
        <Html
          // position={[1, playerCharacter.size[1] * 0.7, ]}
          zIndexRange={[100]}
          center
          style={{
            width: "max-content",
            bottom: isMobile ? 10 : 100,
            alignContent: "center",
            alignItems: "center",
            zIndex: 0,
          }}
        >
          {playerEmojiUrl && <img alt="emoji" style={{ zIndex: 1 }} src={playerEmojiUrl} width="65px" />}
        </Html>
      )}
    </>
  );
};

export const OtherPlayers = () => {
  const otherPlayerRenderMap = st.use.otherPlayerRenderMap();
  const otherPlayerInitMap = st.use.otherPlayerInitMap();
  return (
    <>
      {[...otherPlayerRenderMap.entries()].map(([userId]) => {
        const playerInit = otherPlayerInitMap.get(userId);
        if (!playerInit) return <></>;
        return <OtherPlayerWrapper key={userId} userId={userId} playerInit={playerInit} />;
      })}
    </>
  );
};

const OtherPlayerWrapper = memo(({ userId, playerInit }: OtherPlayerProp) => {
  const [texture, setTexture] = useState<Texture>();
  useEffect(() => {
    (async () => {
      const t = await loader.loadAsync(`${playerInit.playerCharacter.file.url}?id=${userId}`);
      setTexture(Object.assign(t, { minFilter: NearestFilter, magFilter: NearestFilter }));
    })();
  }, []);
  if (!texture) return <></>;
  return <OtherPlayer userId={userId} playerInit={playerInit} texture={texture} />;
});
interface OtherPlayerProp {
  userId: string;
  playerInit: gql.PlayerInit;
}
export const OtherPlayer = memo(({ userId, playerInit, texture }: OtherPlayerProp & { texture: Texture }) => {
  const animator = createTileTextureAnimator(texture, playerInit.playerCharacter.tileSize);
  const sprite = useRef<Sprite>(null);
  const movement = useRef<{
    prev: gql.PlayerRender;
    next: gql.PlayerRender;
    live: gql.PlayerRender;
  } | null>(null);
  useEffect(() => {
    return st.sub(
      (state) => state.otherPlayerRenderMap,
      (otherPlayerRenderMap) => {
        const data = otherPlayerRenderMap.get(userId);
        if (!sprite.current || !data) return;
        if (!movement.current) {
          movement.current = { prev: data, next: data, live: data };
          sprite.current.position.set(data.playerPosition[0], data.playerPosition[1], 0.1);
        } else {
          movement.current = {
            prev: movement.current.next,
            next: data,
            live: {
              ...data,
              playerPosition: movement.current.live.playerPosition,
              playerVelocity: [
                ((data.playerPosition[0] - movement.current.live.playerPosition[0]) * 16.66) / 1000,
                ((data.playerPosition[1] - movement.current.live.playerPosition[1]) * 16.66) / 1000,
              ],
            },
          };
        }
      }
    );
  }, []);
  useFrame((state, delta) => {
    if (!sprite.current || !movement.current) return;
    // if (movement.current.live.playerVelocity[0] === 0 && movement.current.live.playerVelocity[1] === 0) return;
    movement.current = {
      ...movement.current,
      live: {
        ...movement.current.live,
        playerPosition: [
          movement.current.live.playerPosition[0] + movement.current.live.playerVelocity[0],
          movement.current.live.playerPosition[1] + movement.current.live.playerVelocity[1],
        ],
      },
    };
    sprite.current.position.set(movement.current.live.playerPosition[0], movement.current.live.playerPosition[1], 0);
  });
  useSprite((p) => {
    animator([
      playerInit.playerCharacter[movement.current?.live.playerDirection ?? "right"]?.[
        movement.current?.live.playerSpriteState ?? "idle"
      ].row as number,
      p,
    ]);
  }, playerInit.playerCharacter[movement.current?.live.playerDirection ?? "right"]?.[movement.current?.live.playerSpriteState ?? "idle"] as gql.SpriteDef);
  return (
    <sprite ref={sprite} position={sprite.current?.position}>
      {/* <mesh position={sprite.current?.position}>
        <planeGeometry args={[playerInit.playerCharacter.size[0], playerInit.playerCharacter.size[1]]} />
      </mesh> */}
      <boxGeometry args={[playerInit.playerCharacter.size[0], playerInit.playerCharacter.size[1]]} />
      <spriteMaterial map={texture} transparent />
      <OtherPlayerWorldStatus userId={userId} playerInit={playerInit} />
    </sprite>
  );
});
export const OtherPlayerWorldStatus = ({ userId, playerInit }: { userId: string; playerInit: gql.PlayerInit }) => {
  const [playerRender, setPlayerRender] = useState<gql.PlayerRender | null>(null);
  useEffect(() => {
    return st.sub(
      (state) => state.otherPlayerRenderMap,
      (otherPlayerRenderMap) => {
        const playerRender = otherPlayerRenderMap.get(userId);
        if (playerRender) setPlayerRender(playerRender);
      }
    );
  }, []);
  return playerRender ? <PlayerWorldStatus {...playerRender} {...playerInit} /> : null;
};

export const ProfilePreview = () => {
  const playerCharacter = st.use.playerCharacter();
  return (
    <div
      onClick={() => st.do.setCharacterModal("profile")}
      className="relative bg-white h-[60px] w-[60px] overflow-hidden border-[3px] border-black rounded-[10px] cursor-pointer z-[1] ml-[4px] mr-[10px]"
    >
      <Image
        alt=""
        width={playerCharacter.file.imageSize[0]}
        height={playerCharacter.file.imageSize[1]}
        className="absolute top-[-8px] left-[-12px] scale-[1.1] origin-center origin-top-left"
        // className="m-[-10px] origin-top-left scale-[2.4] user-drag-none"
        style={{ imageRendering: "pixelated" }}
        src={playerCharacter.file.url}
      />
    </div>
  );
};

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
  distance: number | null;
}
type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

export const Controller = () => {
  // const setKey = useGame((state) => state.setKey);
  // const playerDirection = st.ref((state) => state.playerDirection);
  const keyboard = st.use.keyboard();
  const keyLock = st.use.keyLock();

  const innerWidth = st.use.innerWidth();
  // const innerHeight = st.use.innerHeight();
  // const screen = useGame((state) => state.screen);
  // const interaction = useWorld((state) => state.interaction);
  // const callRoom = useGossip((state) => state.callRoom);
  // const setMic = useGossip((state) => state.setMic);

  const handleMove = (event: IJoystickUpdateEvent) => {
    console.log(
      event.x,
      event.y
      // innerWidth,
      // innerHeight,
      // event.x && event.x > innerWidth / 2 / 8 / innerWidth,
      // innerWidth / 2 / 8 / innerWidth
    );
    if (!event.x || !event.y) return;
    const keys = { left: event.x < -0.5, right: event.x > 0.5, up: event.y > 0.5, down: event.y < -0.5 };
    if (
      keyboard.left === keys.left &&
      keyboard.right === keys.right &&
      keyboard.up === keys.up &&
      keyboard.down === keys.down
    )
      return;
    st.do.setKeyboard({ ...keyboard, ...keys });
  };
  const handleStop = (event: IJoystickUpdateEvent) => {
    console.log("stop");
    st.do.setKeyboard({ ...keyboard, left: false, right: false, up: false, down: false });
  };

  return (
    <div className="">
      <Joystick
        size={innerWidth / 4}
        baseColor="rgba(101,101,101,0.85)"
        stickColor="#adadad"
        move={handleMove}
        stop={handleStop}
        throttle={0}
        minDistance={0}
      />
    </div>
  );
};
