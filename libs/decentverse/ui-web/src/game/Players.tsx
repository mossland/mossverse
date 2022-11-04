import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { store, gql } from "@decentverse/data-access";
import { Sprite, Texture, TextureLoader } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useDuration, createTileTextureAnimator } from "../_hooks";
import PubSub from "pubsub-js";

export interface PlayersProp {
  playerId: string;
}
export const Players = ({ playerId }: PlayersProp) => {
  const otherPlayers = store.world.use.otherPlayers();
  const otherPlayerIds = store.world.use.otherPlayerIds();
  return (
    <>
      {otherPlayerIds.map((id) => {
        const otherPlayer = otherPlayers.get(id);
        return otherPlayer && otherPlayer.id !== playerId ? (
          <OtherPlayerWrapper key={otherPlayer.id} player={otherPlayer} />
        ) : null;
      })}
    </>
  );
};

const OtherPlayerWrapper = React.memo(({ player }: any) => {
  const [texture, setTexture] = useState<Texture>();
  useEffect(() => {
    (async () => {
      const t = await new TextureLoader().loadAsync(`${player.character.file.url}?id=${player.id}`);
      setTexture(t);
    })();
  }, []);
  return texture ? <OtherPlayer player={player} texture={texture} /> : <></>;
});

export interface OtherPlayerProp {
  player: gql.OtherPlayer;
  texture: Texture;
}
export const OtherPlayer = React.memo(({ player, texture }: OtherPlayerProp) => {
  const lockKey = store.game.use.lockKey();
  const animator = createTileTextureAnimator(texture, player.character.tileSize);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<gql.SpriteDef>(player.character.right.idle);
  const movement = useRef<{
    prev: gql.RenderOtherPlayer;
    next: gql.RenderOtherPlayer;
    live: gql.RenderOtherPlayer;
  } | null>(null);
  useEffect(() => {
    const subscription = (id: string, data: gql.RenderOtherPlayer) => {
      if (!sprite.current) return;
      animation.current = (player.character as any)[data.direction][data.state];
      if (!movement.current) {
        movement.current = { prev: data, next: data, live: data };
        sprite.current.position.set(data.position[0], data.position[1], 0);
      } else {
        movement.current = {
          prev: movement.current.next,
          next: data,
          live: {
            ...data,
            position: movement.current.live.position,
            velocity: [
              ((data.position[0] - movement.current.live.position[0]) * 16.66) / 250,
              ((data.position[1] - movement.current.live.position[1]) * 16.66) / 250,
            ],
          },
        };
        if (
          data.chatText !== movement.current.prev.chatText ||
          data.isTalk !== movement.current.prev.isTalk ||
          data.emoji !== movement.current.prev.emoji
        )
          PubSub.publish(`chat:${player.id}`, {
            chatText: data.chatText,
            isTalk: data.isTalk,
            emoji: data.emoji,
          });
      }
    };
    PubSub.subscribe(player.id, subscription);
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);
  useFrame((state, delta) => {
    if (!sprite.current || !movement.current) return;
    movement.current.live.position = [
      Math.floor(movement.current.live.position[0] + movement.current.live.velocity[0]),
      Math.floor(movement.current.live.position[1] + movement.current.live.velocity[1]),
    ];
    sprite.current.position.set(movement.current.live.position[0], movement.current.live.position[1], 0);
  });
  useDuration((p) => {
    animator([animation.current.row, p]);
  }, animation);

  return (
    <sprite ref={sprite} position={sprite.current?.position}>
      <mesh
        position={sprite.current?.position}
        onClick={(event) => {
          store.world.setState({ otherPlayer: player });
          store.game.setState({ pointer: [event.nativeEvent.clientX, event.nativeEvent.clientY] });
          lockKey(true);
        }}
      >
        <planeGeometry args={[player.character.size[0], player.character.size[1]]} />
      </mesh>
      <boxGeometry args={[player.character.size[0], player.character.size[1]]} />
      <spriteMaterial map={texture} />
      {/* <Text
        lineHeight={0.8}
        position={[0, -24, 1]}
        fontSize={6}
        maxWidth={10}
        material-toneMapped={false}
        color="#DFDFDF"
      >
        {player.user?.nickname}
      </Text> */}
      <Html
        center
        zIndexRange={[100]}
        style={{
          lineHeight: "1.2em",
          fontSize: "22px",
          color: "#DFDFDF",
          marginTop: "76px",
          marginLeft: "1px",
          textAlign: "center",
          whiteSpace: "nowrap",
          zIndex: 1,
        }}
      >
        {player.user?.nickname}
      </Html>
      <PlayerEventRender id={player.id} playerSize={player.character.size} />
    </sprite>
  );
});
export const PlayerEventRender = ({ id, playerSize }: { id: string; playerSize: [number, number] }) => {
  const speechBubble = useTexture("/speechBubble.png");
  const [chatState, setChatState] = useState<{
    chatText: string;
    isTalk: boolean;
    emoji: string;
  }>({
    chatText: "",
    isTalk: false,
    emoji: "",
  });
  useEffect(() => {
    const subscription = (_: string, state: { chatText: string; isTalk: boolean; emoji: string }) => {
      setChatState(state);
    };
    PubSub.subscribe(`chat:${id}`, subscription);

    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);
  return (
    <>
      <Html
        center
        style={{
          backgroundColor: `rgba(255,255,255,${chatState.chatText.length ? 0.7 : 0})`,
          maxWidth: 300,
          width: "max-content",
          borderRadius: 10,
          bottom: 35,
          padding: 10,
          alignContent: "center",
          alignItems: "center",
          wordWrap: "normal",
        }}
      >
        {chatState.chatText}
      </Html>
      <Html
        position={[1, playerSize[1] * 0.7, 1]}
        center
        style={{
          width: "max-content",
          // bottom: isMobile ? 10 : -30,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {chatState.emoji && <img alt="emoji" src={chatState.emoji} width="65px" />}
      </Html>
      {chatState.isTalk && (
        <sprite position={[8, 35, 0]}>
          <planeGeometry args={[25, 25]} />
          <spriteMaterial map={speechBubble} />
        </sprite>
      )}
    </>
  );
};
