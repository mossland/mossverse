"use client";
import * as Listing from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { DataMenuItem } from "@util/client";
import { fetch, st } from "../../client";

export const Menu: DataMenuItem = {
  key: "listing",
  label: "Listing",
  icon: <AiOutlineWarning />,
  render: () => <Listing.Zone.Admin />,
};

interface BuyProps {
  price: number;
  money: string;
}

export const Buy = ({ price, money }: BuyProps) => {
  const moneyOwnerships = st.use.moneyOwnerships();
  const moneyOwnership = fetch.shared.Ownership.getByName(moneyOwnerships, money);
  console.log(moneyOwnerships);
  console.log(!moneyOwnership, moneyOwnership?.has(price) === false);
  console.log(moneyOwnership);
  return (
    <button
      className={`w-full mt-[20px] mb-[24px] p-[8px] text-center text-[22px] rounded-md border-[2px] border-solid border-[#000] bg-primary "disabled:opacity-50 disabled:hover:opacity-0 disabled:cursor-default disabled:bg-[#ddd] disabled:opacity-50`}
      disabled={!moneyOwnership || moneyOwnership.has(price) === false}
      onClick={async () => st.do.buyListing()}
    >
      Buy
    </button>
  );
};

interface CancelProps {
  id?: string;
}
export const Cancel = ({ id }: CancelProps) => {
  return (
    <button
      className={`w-full mt-[20px] mb-[24px] p-[8px] text-center text-[22px] rounded-md border-[2px] border-solid border-[#000] bg-main-yellow  `}
      onClick={() => st.do.cancelListing()}
    >
      Cancel Listing
    </button>
  );
};
