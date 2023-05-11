import { st, gql, slice, useLocale } from "@shared/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import Image from "next/image";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const OwnershipItem = ({
  className,
  ownership,
  slice = st.slice.ownership,
  actions,
  columns,
}: ModelProps<slice.OwnershipSlice, gql.LightOwnership>) => {
  const { l } = useLocale();
  return (
    <DataItem
      cover={<Image alt="ownership" width={324} height={324} src={ownership.getImageUrl()} />}
      title={`${ownership.getName()}`}
      model={ownership}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};

type OwnershipItemInSelfProps = {
  slice?: slice.OwnershipSlice;
  onClick: (item: gql.Ownership | gql.LightOwnership) => void;
  actions?: ReactNode;
  ownership: gql.Ownership | gql.LightOwnership;
  self: gql.User;
};

export const OwnershipItemInSelf = ({ slice = st.slice.ownership, ownership, onClick }: OwnershipItemInSelfProps) => {
  const src = ownership.getImageUrl();
  return (
    <button className="bg-transparent hover:opacity-50" onClick={async () => await onClick(ownership)}>
      <div className="flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md aspect-1">
        <div className="w-full h-full rounded-t-md border-[0.5px] border-gray-100">
          {src ? (
            <Image alt="ownership" width={324} height={324} className={` rounded-t-[5px]`} src={src} />
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
  );
};

OwnershipItem.InSelf = OwnershipItemInSelf;
