import React, { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { store, gql } from "@decentverse/data-access";
import { Sprite, SpriteMaterial, Renderer, LinearFilter, EquirectangularReflectionMapping, sRGBEncoding } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useDuration, createTileTextureAnimator } from "../_hooks";
import { Engine, World, Bodies, Vector, Body } from "matter-js";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
export interface PlayerProp {
  sprite: MutableRefObject<Sprite | null>;
  animation: MutableRefObject<gql.SpriteDef>;
  keyboard: MutableRefObject<gql.Keyboard>;
  player: MutableRefObject<gql.RenderCharacter>;
  engine: MutableRefObject<Engine>;
  zoom: number;
}

export const Player = React.memo(({ sprite, animation, keyboard, player, engine, zoom }: PlayerProp) => {
  const { camera, get, set } = useThree();
  const me = store.world.use.me();
  const map = store.map.use.map();
  const renderMe = store.world.use.renderMe();
  const saveUser = store.user.use.saveUser();
  const [url] = useTexture([`${me.character.file.url}?id=${me.id}`]);
  // url.mapping = EquirectangularReflectionMapping;
  // url.encoding = sRGBEncoding;
  // url.minFilter = url.magFilter = LinearFilter;

  const body = useRef<Matter.Body>(
    Bodies.rectangle(renderMe.position[0], renderMe.position[1], me.character.size[0], me.character.size[1])
  );
  const save = async () => map && (await saveUser(map.name, player.current.position));
  useEffect(() => {
    World.add(engine.current.world, body.current);
    engine.current.gravity.scale = 0;
    const playerPosition = player.current.position;
    camera.position.setX(playerPosition[0]);
    camera.position.setY(playerPosition[1]);
    if (me.type !== "guest")
      window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        save();
        // localStorage.removeItem("walletconnect");
        // localStorage.removeItem("ally-supports-cache");
        // return (ev.returnValue = "Are you sure you want to close?");
        return;
      });
    return () => {
      World.remove(engine.current.world, body.current);
    };
  }, []);

  useFrame((state, delta) => {
    if (!sprite.current || !me) return;
    const velocity = [
      keyboard.current.right ? me.maxSpeed : keyboard.current.left ? -me.maxSpeed : 0,
      keyboard.current.down ? -me.maxSpeed : keyboard.current.up ? me.maxSpeed : 0,
    ];
    Body.setVelocity(body.current, { x: velocity[0], y: velocity[1] });
    engine.current = Engine.update(engine.current, delta);
    const characterState = velocity[0] === 0 && velocity[1] === 0 ? "idle" : "walk";
    const direction = keyboard.current.right
      ? "right"
      : keyboard.current.left && me.character.left
      ? "left"
      : keyboard.current.up && me.character.up
      ? "up"
      : keyboard.current.down && me.character.down
      ? "down"
      : player.current.direction;

    player.current = {
      ...player.current,
      id: player.current.id,
      position: [body.current.position.x, body.current.position.y],
      velocity,
      direction,
      state: characterState,
    };

    sprite.current.position.x = body.current.position.x;
    sprite.current.position.y = body.current.position.y;
    const character = me.character as any;
    animation.current = character[player.current.direction][player.current.state];
  });

  const animator = createTileTextureAnimator(url, [me.character.tileSize[0], me.character.tileSize[1]]);
  //240 330
  useDuration((p: any) => {
    animator([animation.current.row, p]);
  }, animation);

  useFrame(() => {
    const position = get().camera.position;
    const playerPosition = player.current.position;

    if (!map) return;
    const x = Math.floor((playerPosition[0] - position.x) / 10);
    const y = Math.floor((playerPosition[1] - position.y) / 10);
    const tileSize = map.tileSize;
    const tileNums = [map.tiles[0].length, map.tiles.length];
    const mapWH = [tileSize * tileNums[0], tileSize * tileNums[1]];
    const windowCenter = [window.innerWidth / 2 / zoom, window.innerHeight / 2 / zoom];

    if (x === 0 && y === 0) return;
    if ((x < 0 && camera.position.x > windowCenter[0]) || (x > 0 && mapWH[0] - windowCenter[0] > camera.position.x)) {
      camera.translateX(x);
    }
    if ((y < 0 && camera.position.y > windowCenter[1]) || (y > 0 && mapWH[1] - windowCenter[1] > camera.position.y)) {
      camera.translateY(y);
    }
    // resize 대응
    camera.position.x <= windowCenter[0] && camera.position.setX(windowCenter[0]);
    mapWH[0] - windowCenter[0] <= camera.position.x && camera.position.setX(mapWH[0] - windowCenter[0]);
    camera.position.y <= windowCenter[1] && camera.position.setY(windowCenter[1]);
    mapWH[1] - windowCenter[1] <= camera.position.y && camera.position.setY(mapWH[1] - windowCenter[1]);
  });
  if (!me && !map && !renderMe) return <></>;
  url.minFilter = THREE.NearestFilter;
  url.magFilter = THREE.NearestFilter;
  return (
    <Suspense fallback={null}>
      <sprite ref={sprite}>
        <planeGeometry args={[me.character.size[0], me.character.size[1]]} />
        <spriteMaterial map={url} />
        {/* <Text
          lineHeight={0.8}
          position={[0, -26, 1]}
          fontSize={7.4}
          font="/fonts/UbuntuMono-Regular.ttf"
          maxWidth={10}
          overflowWrap="normal"
          material-toneMapped={false}
          color="#DFDFDF"
          fillOpacity={0.7}
        >
          {me.nickname}
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
          {me.nickname}
        </Html>
        <MyChat />
        <MyEmoji />
      </sprite>
    </Suspense>
  );
});
const MyChat = () => {
  const isTalk = store.callRoom.use.callRoom().isTalk;
  const speechBubble = useTexture("/speechBubble.png");
  const chatText = store.gossip.use.chatText();

  useEffect(() => {
    console.log(isTalk);
  }, [isTalk]);
  return (
    <>
      {chatText.length && (
        <Html
          center
          zIndexRange={[100]}
          style={{
            // backgroundColor: `rgba(255,255,255,${chatText.length ? 0.7 : 0})`,
            backgroundColor: "white",
            maxWidth: 220,
            width: "max-content",
            borderRadius: 10,
            bottom: isMobile ? 10 : 35,
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
          {chatText}
          {/* This is not “The Son of Man” by Rene Magritte.. */}
        </Html>
      )}
      {isTalk && !chatText.length && (
        <sprite position={[8, 35, 0]}>
          {/* <planeGeometry args={isTalk && !chatText.length ? [30, 30] : [0, 0]} /> */}
          <planeGeometry args={[25, 25]} />
          <spriteMaterial map={speechBubble} />
        </sprite>
      )}
    </>
  );
};
const MyEmoji = () => {
  const character = store.world((state) => state.me.character);
  // const checkEmoji = emojiStore.use.checkEmoji();
  const url = store.emoji((state) => state.emoji?.file.url);
  // useEffect(() => {
  //   checkEmoji(keyboard, inventory);
  // }, [keyboard, inventory]);

  return (
    <Html
      position={[1, character.size[1] * 0.7, 1]}
      zIndexRange={[100]}
      center
      style={{
        width: "max-content",
        // bottom: isMobile ? 10 : -30,
        alignContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      {url && <img alt="emoji" style={{ zIndex: 1 }} src={url} width="65px" />}
    </Html>
  );
};
