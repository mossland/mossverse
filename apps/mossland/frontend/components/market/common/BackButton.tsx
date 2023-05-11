import { BiChevronLeft } from "react-icons/bi";
import Router from "next/router";
export const BackButton = () => {
  return (
    <button className="bg-transparent" onClick={() => Router.back()}>
      <BiChevronLeft className="mx-2 mt-2 text-[30px]" />
    </button>
  );
};
