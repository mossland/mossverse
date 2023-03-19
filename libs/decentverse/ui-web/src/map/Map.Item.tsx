import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { DataItem } from "@shared/ui-web";
import { ModelProps } from "@shared/util-client";
import { twMerge } from "tailwind-merge";

export const MapItem = ({
  className,
  map,
  slice = st.slice.map,
  onClick,
  actions,
  columns,
}: ModelProps<slice.MapSlice, gql.LightMap>) => {
  return (
    <DataItem
      className={className}
      onClick={() => onClick?.(map)}
      title={`${map.name}`}
      model={map}
      slice={slice}
      actions={actions}
      columns={columns}
    />
  );
};
