import { AiOutlineClockCircle } from "react-icons/ai";
import { DataItem, Link } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch, usePage } from "@platform/client";
import dayjs from "dayjs";

export const Admin = ({
  className,
  receipt,
  sliceName = "receipt",
  actions,
  columns,
}: ModelProps<"receipt", fetch.LightReceipt>) => {
  const { l } = usePage();
  return (
    <DataItem
      // className={className}
      title={`${receipt.id}`}
      model={receipt}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};

export const Abstract = ({ receipt, href }: ModelProps<"receipt", fetch.LightReceipt>) => {
  return (
    <Link href={href} className="p-2 border-b border-base-content/20 cursor-pointer hover:bg-base-200">
      <h3 className="mb-2 text-lg">{receipt.name}</h3>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 mr-2 rounded ${
            receipt.status === "success" ? "bg-green-200 text-black" : "bg-base-200 border border-base-content/20 "
          }`}
        >
          {receipt.status}
        </span>
        <AiOutlineClockCircle className="mr-1" />
        {dayjs(receipt.createdAt).format("YYYY-MM-DD HH:mm")}
      </div>
    </Link>
  );
};
