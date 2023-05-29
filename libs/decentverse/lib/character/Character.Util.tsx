"use client";
import * as Character from "./_client";
import { AiOutlineQq } from "react-icons/ai";
import { DataDashboard, Image, ModalContainer } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { Html } from "@react-three/drei";
import { Joystick } from "react-joystick-component";
import { NearestFilter, Sprite, Texture } from "three";
import { createTileTextureAnimator, fetch, loader, st, useSprite } from "@decentverse/client";
import { isMobile } from "react-device-detect";
import { memo, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export const Menu: DataMenuItem = {
  key: "character",
  label: "Character",
  icon: <AiOutlineQq />,
  render: () => <Character.Zone.Admin />,
};
export const Stat = ({
  className,
  summary,
  sliceName = "character",
  queryMap = fetch.characterQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.CharacterSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalCharacter"]}
      hidePresents={hidePresents}
    />
  );
};

export const SelectPlayerCharacter = () => {
  const playerType = st.use.playerType();
  const playerNickname = st.use.playerNickname();
  const [select, setSelect] = useState<fetch.LightCharacter>();
  const characterMap = st.use.characterMap();
  useEffect(() => {
    st.do.initCharacter({ query: { status: "approved", name: "default" } });
  }, []);
  useEffect(() => {
    if (characterMap === "loading") return;
    setSelect([...characterMap.values()][0]);
  }, [characterMap]);
  return (
    <ModalContainer
      showModal={!!playerType}
      closeShowModal={() => st.do.setPlayerType(null)}
      title="Select Your Character"
    >
      <div className="flex justify-center gap-4 my-4">
        {(characterMap === "loading" ? [] : [...characterMap.values()]).map((character: fetch.LightCharacter) => (
          <Character.Unit.Abstract
            className={character.id === select?.id ? "border-[#fff]" : "border-[#555]"}
            key={character.id}
            character={character}
            onClick={() => setSelect(character)}
          />
        ))}
      </div>
      <div className="h-auto">
        <div className="relative w-[100px] h-[200px] overflow-hidden my-0 mx-auto">
          {select?.file.url && (
            <Image
              className="absolute scale-[1.8] object-left-top origin-top-left"
              file={select.file}
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
      </div>
      <div className="px-[22px]">
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
  playerCharacter?: fetch.LightCharacter;
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
  playerInit: fetch.PlayerInit;
}
export const OtherPlayer = memo(({ userId, playerInit, texture }: OtherPlayerProp & { texture: Texture }) => {
  const animator = createTileTextureAnimator(texture, playerInit.playerCharacter.tileSize);
  const sprite = useRef<Sprite>(null);
  const movement = useRef<{
    prev: fetch.PlayerRender;
    next: fetch.PlayerRender;
    live: fetch.PlayerRender;
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
  }, playerInit.playerCharacter[movement.current?.live.playerDirection ?? "right"]?.[movement.current?.live.playerSpriteState ?? "idle"] as fetch.SpriteDef);
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
export const OtherPlayerWorldStatus = ({ userId, playerInit }: { userId: string; playerInit: fetch.PlayerInit }) => {
  const [playerRender, setPlayerRender] = useState<fetch.PlayerRender | null>(null);
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
        className="absolute top-[-8px] left-[-12px] scale-[1.8] origin-top-left"
        style={{ imageRendering: "pixelated" }}
        file={playerCharacter.file}
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
  // const character = useGossip((state) => state.character);
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
    const keys = {
      left: event.x < -0.5,
      right: event.x > 0.5,
      up: event.y > 0.5,
      down: event.y < -0.5,
    };
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
    st.do.setKeyboard({
      ...keyboard,
      left: false,
      right: false,
      up: false,
      down: false,
    });
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

interface ApproveProps {
  id: string;
}
export const Approve = ({ id }: ApproveProps) => {
  return (
    <button className="text-white bg-green-400 rounded-md" onClick={() => st.do.approveCharacter(id)}>
      Approve
    </button>
  );
};
interface RejectProps {
  id: string;
}
export const Reject = ({ id }: RejectProps) => {
  return (
    <button className="text-white bg-red-400 rounded-md" onClick={() => st.do.rejectCharacter(id)}>
      Reject
    </button>
  );
};
