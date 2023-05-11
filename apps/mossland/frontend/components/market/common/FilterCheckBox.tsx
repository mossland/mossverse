import { st } from "./../../../stores";
export const FilterCheckBox = () => {
  const queryOfListing = st.use.queryOfListing();
  return (
    <div className="flex items-center ">
      <div className="text-gray-500 text-[14px]">할인 중인 상품만</div>
      <input
        type="checkbox"
        checked={queryOfListing["priceTags.discountPrice"] ? true : false}
        onChange={async (e) => {
          await st.do.setQueryOfListing({
            ...queryOfListing,
            "priceTags.discountPrice": e.target.checked ? { $ne: null } : undefined,
          });
        }}
        className="ml-2 accent-gray-500"
      />
    </div>
  );
};
