import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@platform/client";

export const Admin = ({
  className,
  snapshot,
  sliceName = "snapshot",
  actions,
  columns,
}: ModelProps<"snapshot", fetch.LightSnapshot>) => {
  return (
    <DataItem
      className={className}
      title={`${snapshot.id}`}
      model={snapshot}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
