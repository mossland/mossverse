import { Image, OnlyAdmin } from "@shared/client";
import { fetch, usePage } from "@decentverse/client";

interface GeneralProps {
  character: fetch.Character | fetch.LightCharacter;
}

export const General = ({ character }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div className="block gap-5 my-5 md:flex">
      <div className="flex items-center justify-center flex-1 px-5">
        <Image
          width={324}
          height={324}
          className="shadow-lg rounded-md w-[324px] h-[324px] flex items-center justify-center p-3 my-3"
          file={character.file}
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
      </div>
    </div>
  );
};
