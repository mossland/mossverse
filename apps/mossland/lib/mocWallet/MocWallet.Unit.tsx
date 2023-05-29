import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@mossland/client";

export const Admin = ({
  className,
  mocWallet,
  sliceName = "mocWallet",
  actions,
  columns,
}: ModelProps<"mocWallet", fetch.LightMocWallet>) => {
  return (
    <DataItem
      className={className}
      title={`${mocWallet.id}`}
      model={mocWallet}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
