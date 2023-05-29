"use client";
import { DataItem, Image, Link } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@decentverse/client";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
export const Admin = ({
  sliceName = "character",
  character,
  actions,
  columns,
}: ModelProps<"character", fetch.LightCharacter>) => {
  return (
    <DataItem
      title={character.id}
      cover={<img alt="file" src={character.file.url} />}
      model={character}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

export const ForUser = ({
  character,
  href,
  actions,
  columns,
  className,
}: ModelProps<"character", fetch.LightCharacter>) => {
  return (
    <Link className={className} href={href}>
      <button
        key={character.id}
        className={"flex items-center justify-center w-full px-0 py-4 bg-transparent hover:opacity-50"}
      >
        <div className="flex items-center justify-center flex-1 rounded-md shadow-md ">
          <img className="w-[50px] h-[50px]  " src={character.file.url} />
        </div>
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
    </Link>
  );
};

export const Abstract = ({ className, character, href }: ModelProps<"character", fetch.LightCharacter>) => {
  return (
    <Link href={href}>
      <div
        className={twMerge(
          `relative w-[56px] h-[56px] border-[2px] border-solid border-[#000] bg-[#cdcecf] overflow-hidden rounded-[8px] cursor-pointer`,
          className
        )}
      >
        <Image
          className="absolute scale-[1.8] origin-top-left"
          style={{ imageRendering: "pixelated" }}
          file={character.file}
        />
      </div>
    </Link>
  );
};
