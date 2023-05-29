import { DataItem, Image, Link } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({
  listing,
  sliceName = "listing",
  actions,
  columns,
}: ModelProps<"listing", fetch.LightListing>) => {
  return (
    <DataItem
      cover={<Image width={324} height={324} src={listing.getImageUrl()} />}
      title={`${listing.getName()}`}
      model={listing}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

interface MarketProps {
  listing: fetch.Listing | fetch.LightListing;
  href?: string;
}

export const Market = ({ listing, href }: MarketProps) => {
  const src = listing.getImageUrl();
  return (
    <Link href={href}>
      <button className="w-full bg-transparent hover:opacity-50">
        <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
          <div className=" w-full h-full flex  rounded-t-md border-[0.5px] border-gray-100">
            {src ? (
              <Image width={324} height={324} className={`w-full h-full rounded-t-[5px]`} src={src} />
            ) : (
              <div className="flex w-[324px] items-center justify-center">no image</div>
            )}
          </div>
        </div>
        <div className={`p-[2px] rounded-b-md shadow-md releative`}>
          <div className={`text-[18px] text-black ml-[10px] font-bold mb-[4px] text-start `}>{listing.getName()}</div>
          <div className="text-[14px] mx-2 flex font-bold justify-between">
            <div className="text-[14px]  flex font-bold text-black">
              <img className="w-5 h-5 mr-2" src={listing.priceTags[0].getImageUrl()} />
              <div
                className={`text-[14px] flex font-bold text-black ${
                  listing.priceTags[0].discountPrice ? "text-gray-500 line-through mr-1" : ""
                }`}
              >
                {listing.priceTags[0].price}
              </div>
              <div className="text-[14px] flex font-bold text-black">{listing.priceTags[0].discountPrice}</div>
            </div>
            {!!listing.value && (
              <>
                {listing.value}/{listing.totalValue()}
              </>
            )}
          </div>
        </div>
      </button>
    </Link>
  );
};
interface SelfProps {
  listing: fetch.Listing | fetch.LightListing;
  href?: string;
}

export const Self = ({ listing, href }: SelfProps) => {
  const src = listing.getImageUrl();
  return (
    <Link href={href}>
      <button className="bg-transparent hover:opacity-50">
        <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
          <div className="w-full h-full rounded-t-md border-[0.5px] border-gray-100">
            {src ? (
              <Image width={324} height={324} className={` rounded-t-[5px]`} src={src} />
            ) : (
              <div className="flex w-[324px] h-[324px] items-center justify-center">no image</div>
            )}
          </div>
        </div>
        <div className={`p-[2px] rounded-b-md shadow-md releative bg-[#FFE177]`}>
          <div className={`text-[18px] text-black ml-[10px] font-bold mb-[4px] text-start `}>{listing.getName()}</div>
          <div className="text-[14px] mx-2 flex font-bold justify-between">
            <div className="text-[14px]  flex font-bold text-black">
              <img className="w-5 h-5 mr-2" src={listing.priceTags[0].getImageUrl()} />
              <div
                className={`text-[14px] flex font-bold text-black ${
                  listing.priceTags[0].discountPrice ? "text-gray-500 line-through mr-1" : ""
                }`}
              >
                {listing.priceTags[0].price}
              </div>
              <div className="text-[14px] flex font-bold text-black">{listing.priceTags[0].discountPrice}</div>
            </div>
            {!!listing.value && (
              <>
                {listing.value}/{listing.totalValue()}
              </>
            )}
          </div>
        </div>
      </button>
    </Link>
  );
};
