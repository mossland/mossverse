import { Image, Link } from "@shared/client";
import { Listing, fetch, usePage } from "@platform/client";

interface GeneralProps {
  listing: fetch.Listing | fetch.LightListing;
  className?: string;
}
export const General = ({ listing, className }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <Image className="rounded-md shadow-md" width={324} height={324} src={listing.getImageUrl()} />
      </div>
      <hr className="mx-5 mt-5 border-[0.5px] border-gray-300" />
      <div className="z-[10] p-[20px] flex-1 relative overflow-auto h-[370px]">
        <div className="text-[24px] text-gray-500">상품명</div>
        <div className="text-[18px] ml-4"> {listing.getName()}</div>
        <div className="mt-4">
          <div className="text-[24px] text-gray-500">가격</div>
          <div className="relative ml-4 pl-[34px] w-100%">
            <Image
              className="absolute top-1/2 left-[6px] translate-x-0 translate-y-[-50%] w-[20px]"
              src={listing.priceTags?.[0].thing?.image.url ?? ""}
            />
            <div className="flex">
              <div className="text-[18px]">
                {listing.priceTags?.[0].price}&nbsp;
                {listing?.priceTags?.[0].getName()}
              </div>
              <div className="text-[18px]"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-[24px] text-gray-500">설명</div>
        <div className="text-[18px] ml-4">{listing.getDescription()}</div>
      </div>
    </div>
  );
};

interface SelfProps {
  listing: fetch.Listing | fetch.LightListing;
}

export const Self = ({ listing }: SelfProps) => {
  const { l } = usePage();
  return (
    <div>
      <div className="flex items-center justify-center w-full mt-5">
        <Image className="rounded-md shadow-md" width={324} height={324} src={listing.getImageUrl()} />
      </div>
      <hr className="mx-5 mt-5 border-[0.5px] border-gray-300" />
      <div className="z-[10] p-[20px] flex-1 relative overflow-auto h-[370px]">
        <div className="flex justify-between">
          <div>
            <div className="text-[24px] text-gray-500">상품명</div>
            <div className="text-[18px] text-black  ml-4"> {listing.getName()}</div>
          </div>
          <div>
            {!!listing.value && (
              <div className="text-[17px] text-gray-500  ml-4">
                {listing.value} / {listing.totalValue()}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[24px] text-gray-500">가격</div>
          <div className="relative ml-4 pl-[34px] w-100%">
            <Image
              width={30}
              height={20}
              className="absolute top-1/2 left-[6px] translate-x-0 translate-y-[-50%] w-[20px]"
              src={listing.priceTags[0].getImageUrl()}
            />
            <div className="flex">
              <div
                className={`text-[18px] text-black  ${
                  listing.priceTags[0].discountPrice ? "text-gray-500 line-through mr-1" : ""
                }`}
              >
                {listing.priceTags?.[0].price}&nbsp;
                {listing.priceTags[0].getName()}
              </div>
              {listing.priceTags[0].discountPrice && (
                <div className="text-[18px] text-black mr-3">
                  {listing.priceTags?.[0].discountPrice}&nbsp;
                  {listing.priceTags[0].getName()}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-[24px] text-gray-500">설명</div>
        <div className="text-[18px] text-black ml-4">{listing.getDescription()}</div>
        <Link href="/self/listing">
          <Listing.Util.Cancel id={listing.id} />
        </Link>
      </div>
    </div>
  );
};

interface MarketProps {
  listing: fetch.Listing | fetch.LightListing;
  money?: string;
}

export const Market = ({ listing, money }: MarketProps) => {
  const { l } = usePage();
  return (
    <div className="block w-full md:flex ">
      <div className="flex items-center justify-center w-full mt-5">
        <Image className="rounded-md shadow-md" width={324} height={324} src={listing.getImageUrl()} />
      </div>
      <hr className="md:hidden mx-5 mt-5 border-[0.5px] border-gray-300" />
      <div className="z-[10] p-[20px] w-full relative overflow-auto h-[370px]">
        <div className="flex justify-between">
          <div>
            <div className="text-[24px] text-gray-500">상품명</div>
            <div className="text-[18px] text-black  ml-4"> {listing.getName()}</div>
          </div>
          <div>
            {!!listing.value && (
              <div className="text-[17px] text-gray-500  ml-4">
                {listing.value} / {listing.totalValue()}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[24px] text-gray-500">가격</div>
          <div className="relative ml-4 pl-[34px] w-100%">
            <Image
              width={30}
              height={20}
              className="absolute top-1/2 left-[6px] translate-x-0 translate-y-[-50%] w-[20px]"
              src={listing.priceTags[0].getImageUrl()}
            />
            <div className="flex">
              <div
                className={`text-[18px] text-black  ${
                  listing.priceTags[0].discountPrice ? "text-gray-500 line-through mr-1" : ""
                }`}
              >
                {listing.priceTags?.[0].price}&nbsp;
                {listing.priceTags[0].getName()}
              </div>
              {listing.priceTags[0].discountPrice && (
                <div className="text-[18px] text-black mr-3">
                  {listing.priceTags?.[0].discountPrice}&nbsp;
                  {listing.priceTags[0].getName()}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-[24px] text-gray-500">설명</div>
        <div className="text-[18px] text-black ml-4">{listing.getDescription()}</div>
        {listing.priceTags[0]?.price && money && <Listing.Util.Buy price={listing.priceTags[0].price} money={money} />}
      </div>
    </div>
  );
};
