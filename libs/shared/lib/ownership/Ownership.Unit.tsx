"use client";
import { DataItem, Image, Link, fetch, usePage } from "@shared/client";
import { ModelProps } from "@util/client";

export const Admin = ({
  className,
  ownership,
  sliceName = "ownership",
  actions,
  columns,
}: ModelProps<"ownership", fetch.LightOwnership>) => {
  const { l } = usePage();
  return (
    <DataItem
      cover={<Image width={324} height={324} src={ownership.getImageUrl()} />}
      title={`${ownership.getName()}`}
      model={ownership}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

type OwnershipItemInSelfProps = {
  href?: string;
  ownership: fetch.Ownership | fetch.LightOwnership;
};

export const InSelf = ({ ownership, href }: OwnershipItemInSelfProps) => {
  const src = ownership.getImageUrl();
  return (
    <Link href={href}>
      <button className="bg-transparent hover:opacity-50">
        <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
          <div className="w-full h-full rounded-t-md border-[0.5px] border-gray-100">
            {src ? (
              <Image width={324} height={324} className="rounded-t-[5px]" src={src} />
            ) : (
              <div className="flex w-[324px] h-[324px] items-center justify-center">no image</div>
            )}
          </div>
        </div>
        <div className="p-[4px] bg-green-200 rounded-b-md shadow-md releative">
          <div className="text-[12px]  ml-[10px] font-bold mb-5 text-start">{ownership.getName()}</div>
          <div className="flex ml-[10px] justify-between items-center">
            <div />
          </div>
        </div>
      </button>
    </Link>
  );
};
