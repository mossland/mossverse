import { st, gql, slice } from "@decentverse/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { Button } from "antd";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { Character } from "..";
import Image from "next/image";
export const CharacterItem = ({
  character,
  slice = st.slice.character,
  actions,
  columns,
}: ModelProps<slice.CharacterSlice, gql.LightCharacter>) => {
  return (
    <DataItem
      title={character.id}
      cover={<img alt="file" src={character.file.url} />}
      model={character}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

const CharacterItemForUser = ({
  character,
  slice = st.slice.character,
  onClick,
  actions,
  columns,
}: ModelProps<slice.CharacterSlice, gql.LightCharacter>) => {
  return (
    <button
      key={character.id}
      onClick={() => onClick?.(character)}
      className="flex items-center justify-center w-full px-0 py-4 bg-transparent hover:opacity-50"
    >
      <div className="flex items-center justify-center flex-1 rounded-md shadow-md ">
        <img className="w-[50px] h-[50px]  " src={character.file.url} />
      </div>
      <div className="flex-1 text-center">{character.name}</div>
      <div className="flex-1 text-center">{dayjs(character.updatedAt).format("YYYY-MM-DD a hh:mm:ss")}</div>
      <div className="flex items-center justify-center flex-1 text-center">
        <div className="my-3">
          <div className={`flex`}>
            <div
              className={`min-w-[80px] text-center text-white rounded-md ${
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
          </div>
        </div>
      </div>
    </button>
  );
};

CharacterItem.ForUser = CharacterItemForUser;

const CharacterItemAbstract = ({
  className,
  character,
  slice = st.slice.character,
  actions,
  columns,
  idx,
  onClick,
}: ModelProps<slice.CharacterSlice, gql.LightCharacter>) => {
  return (
    <div key={idx} onClick={() => onClick?.(character)}>
      <div
        className={twMerge(
          `relative w-[56px] h-[56px] border-[2px] border-solid border-[#000] bg-[#cdcecf] overflow-hidden rounded-[8px] cursor-pointer`,
          className
        )}
      >
        <Image
          width={character.file.imageSize[0]}
          height={character.file.imageSize[1]}
          className="absolute top-[-8px] left-[-12px] scale-[1.1] origin-center origin-top-left"
          style={{
            imageRendering: "pixelated",
          }}
          src={character.file.url}
          alt="character"
        />
      </div>
    </div>
  );
};

CharacterItem.Abstract = CharacterItemAbstract;
