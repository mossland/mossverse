"use client";
import { AreaBox } from "../../client";
import { BiX } from "react-icons/bi";
import { DataItem } from "@shared/client";
import { ModelProps } from "@util/client";
import { fetch, st } from "@decentverse/client";
import { useBox } from "@react-three/p2";

export const Admin = ({
  className,
  collision,
  sliceName = "collision",
  actions,
  columns,
}: ModelProps<"collision", fetch.LightCollision>) => {
  return (
    <DataItem
      className={className}
      title={`Collision`}
      model={collision}
      sliceName={sliceName}
      actions={actions}
      columns={columns}
    >
      <button onClick={() => st.do.selectCollision(collision, { remove: true })} className="absolute top-0 right-0 m-5">
        <BiX />
      </button>
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={collision.wh} center={collision.center} />
    </DataItem>
  );
};

export const World = ({ collision }: ModelProps<"collision", fetch.LightCollision>) => {
  const mapLayerView = st.use.mapLayerView();
  const mapModal = st.use.mapModal();
  const [ref] = useBox(() => ({
    mass: 1,
    position: collision.center,
    args: collision.wh,
    type: "Static",
  }));
  return (
    <mesh ref={ref as any} onClick={() => mapModal === "select" && st.do.selectCollision(collision, { refresh: true })}>
      {mapLayerView.collision && <planeGeometry args={collision.wh} />}
      <meshBasicMaterial color="#FF6666" opacity={0.5} transparent />
    </mesh>
  );
};
