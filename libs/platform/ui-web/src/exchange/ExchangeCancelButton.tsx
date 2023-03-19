import Link from "next/link";

export const ExchangeCancelButton = () => {
  return (
    <Link href="/exchange" passHref>
      <button
        onClick={() => null}
        className="w-full min-h-[60px] p-[13px] rounded-[10px] border-[2px] border-black font-normal text-[22px] leading-[22px] "
      >
        Cancel
      </button>
    </Link>
  );
};
