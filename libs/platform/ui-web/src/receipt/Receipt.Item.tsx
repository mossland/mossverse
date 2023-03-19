import { st, gql, slice, useLocale } from "@platform/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps, useInterval } from "@shared/util-client";
import { Button } from "antd";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

export const ReceiptItem = ({
  className,
  receipt,
  slice = st.slice.receipt,
  actions,
  columns,
}: ModelProps<slice.ReceiptSlice, gql.LightReceipt>) => {
  const { l } = useLocale();
  return (
    <></>
    // <div>
    //   <Image alt="receipt" width={324} height={324} src={receipt.getImageUrl()}></Image>
    //   <div>래플 이름:{receipt.getName()}</div>
    //   <div>
    //     {l("receipt.closeAt")}:{receipt.closeAt.format("YYYY-MM-DD a hh:mm:ss")}
    //   </div>
    //   <div>
    //     {l("receipt.announceAt")}:{receipt.announceAt.format("YYYY-MM-DD a hh:mm:ss")}
    //   </div>
    //   <div>
    //     {l("receipt.entryLimit")}:{receipt.entryLimit}
    //   </div>
    //   <div>
    //     {l("receipt.status")}:{receipt.status}
    //   </div>
    //   <div>
    //     {actions?.map((action) => {
    //       return (
    //         <Button
    //           className={twMerge(
    //             "text-[#333333] text-[14px] font-bold border-[1px] border-[#333333] rounded-[4px] px-[10px] py-[5px] mr-[10px]"
    //           )}
    //         >
    //           {action}
    //         </Button>
    //       );
    //     })}
    //   </div>
    // </div>
    // <DataItem
    //   // className={className}
    //   cover={<Image alt="receipt" width={324} height={324} src={receipt.getImageUrl()} />}
    //   title={`${receipt.getName()}`}
    //   model={receipt}
    //   slice={slice}
    //   actions={actions}
    //   columns={columns}
    // />
  );
};
