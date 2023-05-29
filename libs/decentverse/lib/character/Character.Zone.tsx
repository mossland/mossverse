"use client";
import { BiEdit, BiX } from "react-icons/bi";
import { Character } from "../../client";
import { DataEditModal, DataListContainer, Input, LoadUnits, SignWallet } from "@shared/client";
import { DefaultOf, ModelsProps, ServerInit, logger, useInterval } from "@util/client";
import { Mesh, NearestFilter, Vector3 } from "three";
import {
  createTileTextureAnimator,
  fetch,
  loader,
  st,
  useGameConnection,
  useKeyboard,
  useSprite,
} from "@decentverse/client";
import { twMerge } from "tailwind-merge";
import { useBox } from "@react-three/p2";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const Admin = ({ sliceName = "character", init }: ModelsProps<fetch.Character>) => {
  return (
    <DataListContainer
      type="list"
      init={{
        ...init,
        query: { status: "applied" },
      }}
      sliceName={sliceName}
      edit={
        <DataEditModal
          sliceName={sliceName}
          renderTitle={(character: DefaultOf<fetch.Character>) => `${character.name}`}
        >
          <Character.Edit.General />
        </DataEditModal>
      }
      renderItem={Character.Unit.Admin}
      columns={[
        { key: "file", render: (file) => <img className="w-[40px] h-[40px]" src={file.url}></img> },
        { key: "creator", render: (creator) => <div className="">{creator?.nickname}</div> },
        "status",
        "name",
      ]}
      actions={(character: fetch.LightCharacter, idx: number) => [
        "edit",
        ...(character.status === "applied"
          ? [
              { type: "reject", render: () => <Character.Util.Reject id={character.id} /> },
              { type: "approve", render: () => <Character.Util.Approve id={character.id} /> },
            ]
          : []),
      ]}
    />
  );
};

export interface PlayerProp {
  spawnKey?: string;
}

export const Player = ({ spawnKey }: PlayerProp) => {
  const map = st.use.map();
  const { camera, get, set } = useThree();
  const playerCharacter = st.use.playerCharacter();
  const animator = useRef<any>();
  // const keyboard = st.ref((state) => state.keyboard);
  const cameraMovement = useRef<Vector3>(new Vector3(0, 0, 0));
  const playerPosition = useRef<[number, number]>(
    map === "loading" ? [500, 500] : [map.startPosition[0] ?? 500, map.startPosition[1] ?? 500]
  );
  const playerVelocity = useRef<[number, number]>([0, 0]);
  const playerMaxSpeed = st.ref((state) => state.playerMaxSpeed);
  const playerDirection = st.ref((state) => state.playerDirection);
  const playerSpriteState = st.ref((state) => state.playerSpriteState);
  const keyboard = st.ref((state) => state.keyboard);
  const texture =
    playerCharacter.file &&
    Object.assign(
      loader.load(
        `${playerCharacter.file.url}?id=${playerCharacter.id ?? "player"}`,
        (texture) => (animator.current = createTileTextureAnimator(texture, playerCharacter.tileSize))
      ),
      { minFilter: NearestFilter, magFilter: NearestFilter }
    );
  const ref = useRef<Mesh>(null);
  const [, api] = useBox(() => ({
    mass: 1,
    fixedRotation: true,
    velocity: [0, 0],
    args: playerCharacter.size,
  }));
  useKeyboard();
  useGameConnection(playerCharacter.id ?? "player");
  useEffect(() => {
    if (map === "loading") return;
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
  }, playerCharacter[playerDirection.current]?.[playerSpriteState.current] as fetch.SpriteDef);
  logger.verbose("charcter render");

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={playerCharacter.size} />
      <meshBasicMaterial map={texture} transparent />
      <Character.Util.PlayerWorldStatus />
    </mesh>
  );
};

interface ForUserProps {
  init: ServerInit<"character", fetch.LightCharacter>;
}
export const ForUser = ({ init }: ForUserProps) => {
  return (
    <LoadUnits
      init={init}
      renderItem={(character) => (
        <button
          className="flex w-full"
          onClick={() => st.do.viewCharacter(character.id, { modal: `view-${character.id}` })}
        >
          <Character.Unit.ForUser className="flex w-full" key={character.id} character={character} />
        </button>
      )}
    />
  );
};

interface MarketViewModalProps {
  className?: string;
  money?: string;
}

export const ViewAndEdit = ({ className, money }: MarketViewModalProps) => {
  const character = st.use.character();
  const characterModal = st.use.characterModal();
  const me = st.use.myKeyring();
  const networkType =
    me.wallets[0].network.type === "offchain" || me.wallets[0].network.type === "ganache"
      ? "debugnet"
      : me.wallets[0].network.type;

  if (character === "loading") return <></>;
  return (
    <>
      {characterModal?.includes("view") && (
        <div className="m-5">
          <Character.View.General character={character} />
          {character.status === "approved" ? (
            <button className="w-full px-[18px]  py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-primary items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default">
              판매 준비
            </button>
          ) : character.status === "rejected" ? (
            <button
              className="w-full px-[18px]  py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-primary items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default"
              onClick={() => st.do.editCharacter(character)}
            >
              수정하기
            </button>
          ) : (
            <></>
          )}
        </div>
      )}
      {characterModal?.includes("edit") && (
        <>
          <Character.Edit.ForUser />
          {networkType && (
            <div className="px-4 py-2">
              <SignWallet
                networkType={networkType}
                walletType={me.wallets[0].network.provider as "kaikas" | "metamask" | "walletConnect"}
                onSigned={() => st.do.reapplyCharacter()}
              >
                <button className="w-full  px-[18px]  py-[18px] rounded-[10px] border-[2px] border-solid border-black font-normal text-[18px] leading-[22px] transition duration-500 cursor-pointer bg-primary items-center justify-center flex disabled:bg-gray-300 disabled:opacity-80 disabled:cursor-default">
                  제출
                </button>
              </SignWallet>
            </div>
          )}
        </>
      )}
    </>
  );
};

interface ProfileProps {
  self: fetch.User;
  className?: string;
}
export const Profile = ({ self, className }: ProfileProps) => {
  const playerCharacter = st.use.playerCharacter();
  const playerNickname = st.use.playerNickname();
  const myKeyring = st.use.myKeyring();
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [editName, setEditName] = useState(playerNickname);
  return (
    <div className="absolute w-full h-screen ">
      <div
        className={twMerge("fixed w-full h-screen left-0 top-0 bg-black/40 z-[1]", className)}
        onClick={() => st.do.setCharacterModal(null)}
      />
      <div className="w-[90%] min-w-auto md:w-fit animate-fadeIn z-[2] fixed text-black left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] backdrop-blur-lg rounded-[10px] border-[3px] border-black bg-white">
        <div className="h-[34px]">
          <div className="flex items-center justify-center w-full h-full text-center border-b-2">
            <h2 className="text-[22px]">Profile</h2>
            <div
              onClick={() => st.do.setCharacterModal(null)}
              className="absolute h-[34px] top-0 right-0 border-l-2 hover:cursor-pointer"
            >
              <BiX className="text-[32px]" />
            </div>
          </div>
        </div>
        <div className="overflow-y-hidden rounded-b-[10px] p-4">
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
                {isNameEdit ? (
                  <div className="flex">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <button
                      onClick={() => {
                        st.do.setPlayerNickname(editName);
                        setIsNameEdit(false);
                      }}
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <div className="text-[25px] leading-[1.2em]">
                    {playerNickname}
                    <div
                      className="inline-block ml-[4px] mb-[-6px] cursor-pointer hover:opacity-60 transition duration-300 text-[24px]"
                      onClick={() => {
                        setIsNameEdit(true);
                      }}
                    >
                      <BiEdit />
                    </div>
                  </div>
                )}
                <div className="mt-4">{myKeyring.wallets[0]?.address ?? ""}</div>

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
