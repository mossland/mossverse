import Router from "next/router";
import { BiChevronRight } from "react-icons/bi";
import { st } from "@mossland/frontend/stores";
export const MyTokenButton = () => {
  const onClickButton = () => Router.push("self/listing");

  return (
    <button
      onClick={onClickButton}
      className={
        "w-full mt-[8px] mb-[20px] flex bg-[#ffe177] text-[18px] text-center p-[8px] rounded-md justify-center items-center"
      }
    >
      My Tokens
      <div className="justify-center">
        <BiChevronRight className="mb-[-2px] text-[20px]" />
      </div>
    </button>
  );
};
