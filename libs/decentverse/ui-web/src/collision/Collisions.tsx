import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import { Mesh, Plane, PlaneGeometry, Vector3 } from "three";
import { Bodies, Engine, World } from "matter-js";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Utils } from "@shared/util";
import styled from "styled-components";
import Card from "antd/lib/card/Card";
import { AreaBox, EditPosition } from "../common";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
export interface CollisionsProp {
  collisions?: gql.Collision[] | null;
  engine?: MutableRefObject<Engine>;
}
export const Collisions = ({ engine, collisions = store.map((state) => state.mapForm.collisions) }: CollisionsProp) => {
  return (
    <Suspense fallback={null}>
      {collisions?.map((collision, idx) => (
        <Collision key={idx} collision={collision} engine={engine} />
      ))}
    </Suspense>
  );
};

export interface CollisionProp {
  collision: gql.Collision;
  engine?: MutableRefObject<Engine>;
}
export const Collision = React.memo(({ collision, engine }: CollisionProp) => {
  const position = new Vector3(...collision.center, 1);
  const views = store.map.use.views();
  useEffect(() => {
    if (!engine) return;
    const box = Bodies.rectangle(...collision.center, ...collision.wh, { isStatic: true });
    World.add(engine.current.world, box);
    return () => {
      World.remove(engine.current.world, box);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      {views.includes("collision") && (
        <mesh position={position}>
          <planeGeometry args={collision.wh} />
          <meshBasicMaterial color="#FF6666" opacity={0.5} transparent />
        </mesh>
      )}
    </Suspense>
  );
});
interface CollisionPreviewProps {
  mouse: MutableRefObject<gql.Mouse>;
}
export const CollisionPreview = ({ mouse }: CollisionPreviewProps) => {
  const edit = store.map.use.edit();
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const point = useRef<[number, number] | null>();
  const collisions = store.map((state) => state.mapForm.collisions);
  const updateMap = store.map.use.updateMap();

  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      point.current = null;
      plane.current?.copy(new PlaneGeometry(5, 5));
    };
    window.addEventListener("keydown", cancel);
    return () => {
      window.removeEventListener("keydown", cancel);
    };
  }, []);
  useFrame(() => {
    if (edit !== "collision" || !mesh.current || !plane.current) return;
    if (!point.current) {
      mesh.current.position.set(mouse.current.x, mouse.current.y, 1);
    } else {
      const { center, wh } = Utils.getBox(mouse.current, point.current);
      mesh.current.position.set(...center, 0.1);
      plane.current.copy(new PlaneGeometry(...wh));
    }
  });
  if (edit !== "collision" || !collisions) return <></>;

  const handleClick = async (e: ThreeEvent<PointerEvent> | any) => {
    if (!point.current) point.current = [e.point.x, e.point.y];
    else {
      const center = [
        Math.floor((e.point.x + point.current[0]) / 2),
        Math.floor((e.point.y + point.current[1]) / 2),
      ] as [number, number];
      const wh = [
        Math.abs(Math.floor(e.point.x - point.current[0])),
        Math.abs(Math.floor(e.point.y - point.current[1])),
      ] as [number, number];
      store.map.do.addCollisionsOnMap({ center, wh, id: "", message: "message" });
      plane.current?.copy(new PlaneGeometry(5, 5));
      point.current = null;
      await updateMap();
    }
  };
  return (
    <mesh ref={mesh} onClick={handleClick}>
      <planeGeometry ref={plane} args={[5, 5]} />
      <meshBasicMaterial color="#FF6666" opacity={0.5} transparent />
    </mesh>
  );
};

export const CollsionList = () => {
  const collisions = store.map((state) => state.mapForm.collisions);
  const pointer = store.map.use.pointer();
  const updateMap = store.map.use.updateMap();
  if (!collisions) return <></>;
  const targets = collisions.filter((collision) => Utils.isIn(pointer, collision));
  const handleRemove = async (collision: gql.Collision) => {
    store.map.do.setCollisionsOnMap(collisions.filter((c) => c !== collision));
    await updateMap();
  };

  const handleModify = (collision: gql.Collision): ((center: [number, number], wh: [number, number]) => void) => {
    return async (center: [number, number], wh: [number, number]) => {
      store.map.do.setCollisionsOnMap(
        collisions.map((c) => {
          if (c !== collision) return c;
          return { ...c, center, wh };
        })
      );
      await updateMap();
    };
  };
  return (
    <>
      {targets.map((collision) => (
        <CollisionItem
          key={collision.id}
          collision={collision}
          onRemove={() => handleRemove(collision)}
          onModify={handleModify(collision)}
        />
      ))}
    </>
  );
};
interface CollisionItemProps {
  collision: gql.Collision;
  onRemove: () => void;
  onModify: (center: [number, number], wh: [number, number]) => void;
}
export const CollisionItem = ({ collision, onRemove, onModify }: CollisionItemProps) => {
  return (
    <Card
      title="Collision"
      size="small"
      extra={
        <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
          delete
        </Button>
      }
    >
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={collision.wh} center={collision.center} />
      <EditPosition wh={collision.wh} center={collision.center} onModify={onModify} />
    </Card>
  );
};
