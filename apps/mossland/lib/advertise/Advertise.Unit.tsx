import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@mossland/client";

export const Admin = ({
  className,
  advertise,
  sliceName = "advertise",
  actions,
  columns,
}: ModelProps<"advertise", fetch.LightAdvertise>) => {
  return (
    <DataItem
      className={className}
      title={`${advertise.id}`}
      model={advertise}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
