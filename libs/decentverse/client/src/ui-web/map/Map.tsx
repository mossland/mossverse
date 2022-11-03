import { Canvas } from "@react-three/fiber";
import { types, mapStore } from "../../stores";
import { useKeyboard } from "../../hooks";
import { Stats } from "@react-three/drei";
import { useRef } from "react";
import styled from "styled-components";
import { Tiles } from "../game";
import { Placements, AssetPreview } from "../asset";
import { Button, Card, Descriptions, Modal, Popconfirm, Switch } from "antd";
import { Field } from "@shared/ui-web";
import { CollisionPreview, Collisions } from "../collision";
import { WebviewPreview, Webviews } from "../webview";
import { LivePreview, Lives } from "../live";
import { CallRoomPreview, CallRooms } from "../callRoom";

export const Map = () => {
  const map = mapStore.use.map();
  const mouse = useRef(types.mouse);
  const keyState = useRef(types.keyboard);
  const lockState = useRef(false);
  useKeyboard({ keyState, lockState });

  if (!map) return null;

  return (
    <MapContainer>
      <Canvas camera={{ fov: 75, near: 0.1, far: 4000, position: [0, 0, 1000] }}>
        <ambientLight />
        <AssetPreview mouse={mouse} />
        <CollisionPreview mouse={mouse} />
        <WebviewPreview mouse={mouse} />
        <LivePreview mouse={mouse} />
        <CallRoomPreview mouse={mouse} />
        <Tiles mouse={mouse} />
        <Placements />
        <Collisions />
        <Webviews />
        <Lives />
        <CallRooms />
      </Canvas>
    </MapContainer>
  );
};

export const NewMap = () => {
  const name = mapStore.use.name();
  const tileSize = mapStore.use.tileSize();
  const modalOpen = mapStore.use.modalOpen();
  const addMapFiles = mapStore.use.addMapFiles();
  const purify = mapStore.use.purify();
  const createMap = mapStore.use.create();
  const top = mapStore.use.top();
  const bottom = mapStore.use.bottom();
  const lighting = mapStore.use.lighting();
  return (
    <>
      <Button block onClick={() => mapStore.setState({ ...types.defaultMap, modalOpen: !modalOpen })}>
        New
      </Button>
      <Modal
        title="New Map"
        open={modalOpen}
        onOk={createMap}
        onCancel={() => mapStore.setState({ modalOpen: !modalOpen })}
        okButtonProps={{ disabled: !purify() }}
      >
        <Field.Container>
          <Field.Text label="Name" value={name} onChange={(name) => mapStore.setState({ name })} />
          <Field.Number
            label="TileSize"
            value={tileSize}
            onChange={(tileSize) => mapStore.setState({ tileSize })}
            required
          />
          <Field.Img
            label="Bottom"
            onChange={(fileList) => addMapFiles(fileList, "bottom")}
            value={bottom}
            required
            onRemove={() => mapStore.setState({ bottom: null })}
          />
          <Field.Img
            label="Top"
            onChange={(fileList) => addMapFiles(fileList, "top")}
            value={top}
            onRemove={() => mapStore.setState({ top: null })}
          />
          <Field.Img
            label="Lighting"
            onChange={(fileList) => addMapFiles(fileList, "lighting")}
            value={lighting}
            onRemove={() => mapStore.setState({ lighting: null })}
          />
        </Field.Container>
      </Modal>
    </>
  );
};

export const LoadMap = () => {
  const init = mapStore.use.init();
  const maps = mapStore.use.maps();
  const loadModalOpen = mapStore.use.loadModalOpen();
  const reset = mapStore.use.reset();
  loadModalOpen && init("editor");

  return (
    <>
      <Button block onClick={() => mapStore.setState({ loadModalOpen: !loadModalOpen })}>
        Load
      </Button>
      <Modal
        title="Load Map"
        open={loadModalOpen}
        footer={null}
        onCancel={() => mapStore.setState({ loadModalOpen: !loadModalOpen })}
      >
        {maps.map((map) => (
          <MapItem key={map.id} onClick={() => mapStore.setState({ ...map, map })}>
            {map.name}
          </MapItem>
        ))}
      </Modal>
    </>
  );
};

export const MapInfo = () => {
  const map = mapStore.use.map();

  if (!map)
    return (
      <Card title="Map" size="small" style={{ marginBottom: 20 }}>
        <NewMap />
        <LoadMap />
      </Card>
    );

  return (
    <Card title={`Map: ${map.name}`} size="small" style={{ marginBottom: 20 }}>
      <div>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="tiles">
            {map.tiles[0].length} X {map.tiles.length}
          </Descriptions.Item>
          <Descriptions.Item label="tile size">{map.tileSize}px</Descriptions.Item>
        </Descriptions>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Popconfirm title="Are you sure？" placement="bottomRight" onConfirm={() => mapStore.setState({ map: null })}>
            <a href="#">Close</a>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};
export const MapConfig = () => {
  const dayNight = mapStore((state) => state.config?.dayNight);
  return (
    <Card title="Options" size="small">
      <OptionList>
        <div className="option-item">
          <span>Day Night Mode</span>
          <Switch checked={dayNight} onChange={() => mapStore.setState({ config: { dayNight: !dayNight } })} />
        </div>
      </OptionList>
    </Card>
  );
};

const OptionList = styled.div`
  .option-item {
    margin: 20px 0;
    span {
      margin-right: 10px;
    }
  }
`;

const MapContainer = styled.div`
  /* height: calc(100vh - 40px); */
  height: 100vh;
  background-color: #999;
`;
const MapItem = styled.div`
  position: relative;
  height: 40px;
  border: 1px solid #ddd;
  padding: 6px;
  margin-bottom: 4px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;
