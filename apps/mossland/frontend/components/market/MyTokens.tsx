import { BiChevronRight } from "react-icons/bi";
import { store } from "../../stores";
export const MyTokens = () => {
  const router = store.shared.ui.use.router();
  const onClickButton = () => router.push("market/myTokens");

  return (
    <button
      onClick={onClickButton}
      className={
        "mt-[8px] mb-[20px] flex bg-[#ffe177] text-[18px] text-center p-[8px] rounded-md justify-center items-center"
      }
    >
      My Tokens
      <div className="justify-center">
        <BiChevronRight className="mb-[-2px] text-[20px]" />
      </div>
    </button>
  );
};
