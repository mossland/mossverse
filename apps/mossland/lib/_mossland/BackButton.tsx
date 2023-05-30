"use client";
import { BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/navigation";
export const BackButton = () => {
  const router = useRouter();
  return (
    <button className="bg-transparent" onClick={() => router.back()}>
      <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
    </button>
  );
};
