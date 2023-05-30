import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch } from "@decentverse/client";

export const Admin = ({ className, map, sliceName = "map", actions, columns }: ModelProps<"map", fetch.LightMap>) => {
  return (
    <DataItem
      className={className}
      title={`${map.name}`}
      model={map}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    />
  );
};
