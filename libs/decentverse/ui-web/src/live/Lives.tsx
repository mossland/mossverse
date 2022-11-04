import React, { Suspense, MutableRefObject, useRef, useEffect } from "react";
import { store, gql } from "@decentverse/data-access";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { isMobile } from "react-device-detect";
import { Field } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Utils } from "@shared/util";
import { Button, Card } from "antd";
import { AreaBox } from "../common";
import { DeleteOutlined } from "@ant-design/icons";

export interface LivesProp {
  lives?: gql.Live[] | null;
}
export const Lives = ({ lives = store.map.use.lives() }: LivesProp) => {
  return (
    <Suspense fallback={null}>
      {lives?.map((live, idx) => (
        <Live key={idx} live={live} />
      ))}
    </Suspense>
  );
};

export interface LiveProp {
  live: gql.Live;
}
export const Live = React.memo(({ live }: LiveProp) => {
  const position = new Vector3(...live.center, 0.00009);
  const scale = isMobile ? 0.6 : 1;
  const [width, height] = [live.wh[0] * scale, live.wh[1] * scale];
  const views = store.map.use.views();
  return (
    <mesh position={position}>
      {views.includes("live") && (
        <>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#D96704" opacity={0.5} transparent />
        </>
      )}
      {views.includes("live.iframe") && (
        <Html center zIndexRange={[10000]}>
          <div style={{ zIndex: 10, width: Math.abs(width), height: Math.abs(height) }}>
            <iframe
              title={live.id}
              style={{ width: "100%", height: "100%" }}
              src={live.src}
              // src={"https://www.youtube.com/embed/e7Ary2grhNI"}
              allow="autoplay; muted encrypted-media"
            ></iframe>
          </div>
        </Html>
      )}
    </mesh>
  );
});
export const LiveEdit = () => {
  const src = store.live.use.src();
  return (
    <Field.Container>
      <Field.Text label="source" value={src} onChange={(src) => store.live.setState({ src })} required />
    </Field.Container>
  );
};

interface LivePreviewProps {
  mouse: MutableRefObject<gql.Mouse>;
}
export const LivePreview = ({ mouse }: LivePreviewProps) => {
  const edit = store.map.use.edit();
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const point = useRef<[number, number] | null>();
  const lives = store.map.use.lives();
  const updateMap = store.map.use.updateMap();
  const get = store.live.use.get();
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
    if (edit !== "live" || !mesh.current || !plane.current) return;
    if (!point.current) {
      mesh.current.position.set(mouse.current.x, mouse.current.y, 1);
    } else {
      const { center, wh } = Utils.getBox(mouse.current, point.current);
      mesh.current.position.set(...center, 0.1);
      plane.current.copy(new PlaneGeometry(...wh));
    }
  });
  if (edit !== "live" || !lives) return <></>;

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
      store.map.setState({ lives: [...lives, { ...get(), center, wh, id: "" }] });
      plane.current?.copy(new PlaneGeometry(5, 5));
      point.current = null;
      await updateMap();
    }
  };
  return (
    <mesh ref={mesh} onClick={handleClick}>
      <planeGeometry ref={plane} args={[5, 5]} />
      <meshBasicMaterial color="#D96704" opacity={0.5} transparent />
    </mesh>
  );
};
export const LiveList = () => {
  const lives = store.map.use.lives();
  const pointer = store.map.use.pointer();
  const updateMap = store.map.use.updateMap();
  if (!lives) return <></>;
  const targets = lives.filter((live) => Utils.isIn(pointer, live));
  const handleRemove = async (live: gql.Live) => {
    store.map.setState({ lives: lives.filter((l) => l !== live) });
    await updateMap();
  };
  return (
    <>
      {targets.map((live) => (
        <LiveItem key={live.id} live={live} onRemove={() => handleRemove(live)} />
      ))}
    </>
  );
};
interface LiveItemProps {
  live: gql.Live;
  onRemove: () => void;
}
export const LiveItem = ({ live, onRemove }: LiveItemProps) => {
  return (
    <Card>
      <AreaBox color="#D96704" wh={live.wh} center={live.center} />
      <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
        delete
      </Button>
    </Card>
  );
};
