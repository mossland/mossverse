"use client";
import { BiChevronRight } from "react-icons/bi";
import { Link } from "@shared/client";
import { useRouter } from "next/navigation";
export const MyTokenButton = () => {
  const router = useRouter();

  return (
    <Link
      href="myToken/ownership"
      className={
        "w-full mt-[8px] mb-[20px] flex bg-[#ffe177] text-[18px] text-center p-[8px] rounded-md justify-center items-center"
      }
    >
      My Tokens
      <div className="justify-center">
        <BiChevronRight className="mb-[-2px] text-[20px]" />
      </div>
    </Link>
  );
};
