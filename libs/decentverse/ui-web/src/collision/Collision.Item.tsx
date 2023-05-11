import { st, gql, slice, useLocale } from "@decentverse/data-access";
import { ModelProps } from "@shared/util-client";
import { useBox } from "@react-three/p2";
import { memo } from "react";
import { Mesh } from "three";
import { AreaBox } from "../common";
import { DataItem } from "@shared/ui-web";

export const CollisionItem = ({
  className,
  collision,
  slice = st.slice.collision,
  actions,
  columns,
}: ModelProps<slice.CollisionSlice, gql.LightCollision>) => {
  return (
    <DataItem
      className={className}
      title={`Collision`}
      model={collision}
      slice={slice}
      actions={actions}
      columns={columns}
    >
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={collision.wh} center={collision.center} />
    </DataItem>
  );
};

const CollisionItemWorld = memo(
  ({ collision, slice = st.slice.collision, actions }: ModelProps<slice.CollisionSlice, gql.LightCollision>) => {
    const mapLayerView = st.use.mapLayerView();
    const mapModal = st.use.mapModal();
    const [ref] = useBox(() => ({ mass: 1, position: collision.center, args: collision.wh, type: "Static" }));
    return (
      <mesh
        ref={ref as any}
        onClick={() => mapModal === "select" && slice.do.selectCollision(collision, { refresh: true })}
      >
        {mapLayerView.collision && <planeGeometry args={collision.wh} />}
        <meshBasicMaterial color="#FF6666" opacity={0.5} transparent />
      </mesh>
    );
  }
);
CollisionItem.World = CollisionItemWorld;
