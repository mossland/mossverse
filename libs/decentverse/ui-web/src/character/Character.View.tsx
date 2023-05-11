// import { Image, Tag } from "antd";
import Image from "next/image";
import {
  slice,
  gql,
  st,
  createTileTextureAnimator,
  useSprite,
  useKeyboard,
  useGameConnection,
  useLocale,
  loader,
} from "@decentverse/data-access";
import { OnlyAdmin } from "@shared/ui-web";
import { memo, ReactNode, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { useBox } from "@react-three/p2";
import { Mesh, NearestFilter, Sprite, Vector2, Vector3 } from "three";
import { logger, useInterval } from "@shared/util-client";
import { Character } from "..";
import { twMerge } from "tailwind-merge";
import { BiEdit, BiX } from "react-icons/bi";

interface CharacterViewProps {
  slice?: slice.CharacterSlice;
  character: gql.Character | gql.LightCharacter;
  actions?: ReactNode;
}

export const CharacterView = ({ slice = st.slice.character, character, actions }: CharacterViewProps) => {
  const { l } = useLocale();
  return (
    <div className="block gap-5">
      <div className="flex items-center justify-center flex-1 px-5">
        <Image
          width={324}
          height={324}
          alt=""
          className="shadow-lg rounded-md w-[324px] h-[324px] flex items-center justify-center p-3 my-3"
          src={character.file.url}
        />
      </div>
      <div className="flex-1 px-10">
        <div className={"text-[22px]"}>{l("character.name")}</div>
        <div className={"text-[18px]"}>{character.name}</div>
        <br />
        <div className={"text-[22px]"}>{l("character.description")}</div>
        <div className={"text-[18px]"}>{character.description}</div>
        <br />
        <div className={"text-[22px]"}>{l("character.status")}</div>
        <div
          className={`w-[80px] text-center text-white rounded-md ${
            character.status === "applied"
              ? "bg-blue-400"
              : character.status === "rejected"
              ? "bg-red-400"
              : character.status === "approved"
              ? "bg-green-400"
              : "bg-none"
          }`}
        >
          <div>
            {character.status === "applied"
              ? "검수 중"
              : character.status === "rejected"
              ? "거절됨"
              : character.status === "approved"
              ? "검수 완료"
              : "알 수 없음"}
          </div>
        </div>
        <OnlyAdmin>
          <br />
          <div className={"text-[22px]"}>{l("character.createdAt")}</div>
          <div className={"text-[18px]"}>{character.createdAt.format("YYYY-MM-DD")}</div>
          <br />
          <div className={"text-[22px]"}>{l("character.updatedAt")}</div>
          <div>{character.updatedAt.format("YYYY-MM-DD")}</div>
          <br />
        </OnlyAdmin>
        <br />
        {actions}
      </div>
    </div>
  );
};

export interface CharacterViewPlayerProp {
  map: gql.Map;
  self: gql.User;
  spawnKey?: string;
}

const CharacterViewPlayer = memo(({ map, self, spawnKey }: CharacterViewPlayerProp) => {
  const { camera, get, set } = useThree();
  const playerCharacter = st.use.playerCharacter();
  const animator = useRef<any>();
  // const keyboard = st.ref((state) => state.keyboard);
  const cameraMovement = useRef<Vector3>(new Vector3(0, 0, 0));
  const playerPosition = useRef<[number, number]>([map.startPosition[0] ?? 500, map.startPosition[1] ?? 500]);
  const playerVelocity = useRef<[number, number]>([0, 0]);
  const playerMaxSpeed = st.ref((state) => state.playerMaxSpeed);
  const playerDirection = st.ref((state) => state.playerDirection);
  const playerSpriteState = st.ref((state) => state.playerSpriteState);
  const keyboard = st.ref((state) => state.keyboard);
  const texture =
    playerCharacter.file &&
    Object.assign(
      loader.load(
        `${playerCharacter.file.url}?id=${self.id ?? "player"}`,
        (texture) => (animator.current = createTileTextureAnimator(texture, playerCharacter.tileSize))
      ),
      { minFilter: NearestFilter, magFilter: NearestFilter }
    );
  const ref = useRef<Mesh>(null);
  const [, api] = useBox(() => ({ mass: 1, fixedRotation: true, velocity: [0, 0], args: playerCharacter.size }));
  useKeyboard();
  useGameConnection(self);
  useEffect(() => {
    const spawnPosition = map.getSpawnPosition(spawnKey);
    camera.position.set(...spawnPosition, 0);
    api.position.set(...spawnPosition);
    playerPosition.current = spawnPosition;
    const u1 = api.position.subscribe((p) => {
      playerPosition.current = [
        p[0] / 10 + (playerPosition.current[0] * 9) / 10,
        p[1] / 10 + (playerPosition.current[1] * 9) / 10,
      ];
      ref.current?.position.set(...playerPosition.current, 0);
      const x = (p[0] - camera.position.x) / 20;
      const y = (p[1] - camera.position.y) / 20;
      const windowCenter = [window.innerWidth / 2, window.innerHeight / 2];
      cameraMovement.current.set(
        Math.abs(x) > 0.1 &&
          ((x < 0 && camera.position.x > windowCenter[0] / camera.zoom) ||
            (x > 0 && map.wh[0] - windowCenter[0] / camera.zoom > camera.position.x))
          ? x
          : 0,
        Math.abs(y) > 0.1 &&
          ((y < 0 && camera.position.y > windowCenter[1] / camera.zoom) ||
            (y > 0 && map.wh[1] - windowCenter[1] / camera.zoom > camera.position.y))
          ? y
          : 0,
        0
      );
    });
    const u2 = api.velocity.subscribe((v) => (playerVelocity.current = v));
    const u3 = st.sub(
      (state) => state.keyboard,
      (keyboard) => {
        const velocity = [
          keyboard.right ? playerMaxSpeed.current : keyboard.left ? -playerMaxSpeed.current : 0,
          keyboard.down ? -playerMaxSpeed.current : keyboard.up ? playerMaxSpeed.current : 0,
        ] as [number, number];
        api.velocity.copy(velocity);
        playerSpriteState.current = velocity[0] === 0 && velocity[1] === 0 ? "idle" : "walk";
        playerDirection.current = keyboard.right
          ? "right"
          : keyboard.left && playerCharacter.left
          ? "left"
          : keyboard.up && playerCharacter.up
          ? "up"
          : keyboard.down && playerCharacter.down
          ? "down"
          : playerDirection.current;
        st.set({ playerDirection: playerDirection.current, playerSpriteState: playerSpriteState.current });
      }
    );
    return () => {
      u1();
      u2();
      u3();
    };
  }, [map, spawnKey]);
  useInterval(() => {
    const velocity = [
      keyboard.current.right ? playerMaxSpeed.current : keyboard.current.left ? -playerMaxSpeed.current : 0,
      keyboard.current.down ? -playerMaxSpeed.current : keyboard.current.up ? playerMaxSpeed.current : 0,
    ] as [number, number];
    api.velocity.copy(velocity);
    st.set({ playerPosition: playerPosition.current, playerVelocity: playerVelocity.current });
  }, 100);

  useFrame((state, delta) => {
    camera.position.add(cameraMovement.current);
  });

  useSprite((p: any) => {
    animator.current?.([playerCharacter[playerDirection.current]?.[playerSpriteState.current].row, p]);
  }, playerCharacter[playerDirection.current]?.[playerSpriteState.current] as gql.SpriteDef);
  logger.verbose("charcter render");

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={playerCharacter.size} />
      <meshBasicMaterial map={texture} transparent />
      <Character.Action.PlayerWorldStatus />
    </mesh>
  );
});

CharacterView.Player = CharacterViewPlayer;

interface CharacterViewProfileProps {
  self: gql.User;
  className?: string;
}

export const CharacterViewProfile = ({ self, className }: CharacterViewProfileProps) => {
  const playerCharacter = st.use.playerCharacter();
  const playerNickname = st.use.playerNickname();
  return (
    <div
      className={twMerge("fixed w-full h-screen left-0 top-0 bg-black/40 z-[1]", className)}
      onClick={() => st.do.setCharacterModal(null)}
    >
      <div className="w-[90%] min-w-auto md:w-fit animate-fadeIn z-[2] fixed text-black left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] backdrop-blur-lg rounded-[10px] border-[3px] border-black bg-white">
        <div className="h-[34px]">
          <div className="justify-center w-full h-full text-center border-b-2">
            <h2>Profile</h2>
            <div
              onClick={() => st.do.setCharacterModal(null)}
              className="absolute h-[34px] top-0 right-0 border-l-2 hover:cursor-pointer"
            >
              <BiX className="text-[32px]" />
            </div>
          </div>
        </div>
        <div className="overflow-y-hidden rounded-b-[10px] p-2">
          <div className="rounded-[5px] flex content-center justify-start items-start h-full gap-[30px] py-[20px]">
            <div className="character">
              <div className="relative w-[116px] h-[191px] overflow-hidden bg-[#c3c3c4] mt-[23px] rounded-[8px]">
                <img
                  src={playerCharacter?.file?.url ?? ""}
                  className="mt-[-12px] ml-[12px] scale-[1.5] origin-top-left"
                />
              </div>
            </div>
            <div className="pt-[40px]">
              <div className="playerInfo">
                <div className="text-[25px] leading-[1.2em]">
                  {playerNickname}
                  <div
                    className="inline-block ml-[4px] mb-[-6px] cursor-pointer hover:opacity-60 transition duration-300 text-[24px]"
                    // onClick={() => st.set({ isProfileNameEdit: true })}
                  >
                    <BiEdit />
                  </div>
                </div>
                {/* {isProfileNameEdit ? (
              <ProfileNameEditForm />
            ) : (
              <div className="text-[25px] leading-[1.2em]">
                {render.nickname}
                {isMe() && !user.roles.includes("guest") && (
                  <div
                    className="inline-block ml-[4px] mb-[-6px] cursor-pointer hover:opacity-60 transition duration-300 text-[24px]"
                    onClick={() => st.set({ isProfileNameEdit: true })}
                  >
                    <BiEdit />
                  </div>
                )}
              </div>
            )} */}
                {/* <div className="font-normal text-[22px]">
              <span className="font-bold">tydpe:</span>
              {user.role}
            </div> */}
                {/* {isPossibleEdit && isMe() && !user.roles.includes("guest") && <WalletList />} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CharacterView.Profile = CharacterViewProfile;
