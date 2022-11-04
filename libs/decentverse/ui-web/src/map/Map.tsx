import { Canvas } from "@react-three/fiber";
import { store, gql } from "@decentverse/data-access";
import { useKeyboard } from "../_hooks";
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
  const map = store.map.use.map();
  const mouse = useRef(gql.mouse);
  const keyState = useRef(gql.keyboard);
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
  const name = store.map.use.name();
  const tileSize = store.map.use.tileSize();
  const mapModal = store.map.use.mapModal();
  const addMapFiles = store.map.use.addMapFiles();
  const purifyMap = store.map.use.purifyMap();
  const createMap = store.map.use.createMap();
  const resetMap = store.map.use.resetMap();
  const newMap = store.map.use.newMap();
  const top = store.map.use.top();
  const bottom = store.map.use.bottom();
  const lighting = store.map.use.lighting();
  return (
    <>
      <Button block onClick={newMap}>
        New
      </Button>
      <Modal
        title="New Map"
        open={!!mapModal}
        onOk={createMap}
        onCancel={() => resetMap()}
        okButtonProps={{ disabled: !purifyMap() }}
      >
        <Field.Container>
          <Field.Text label="Name" value={name} onChange={(name) => store.map.setState({ name })} />
          <Field.Number
            label="TileSize"
            value={tileSize}
            onChange={(tileSize) => store.map.setState({ tileSize })}
            required
          />
          <Field.Img
            label="Bottom"
            addFiles={(fileList) => addMapFiles(fileList, "bottom")}
            file={bottom}
            required
            onRemove={() => store.map.setState({ bottom: null })}
          />
          <Field.Img
            label="Top"
            addFiles={(fileList) => addMapFiles(fileList, "top")}
            file={top}
            onRemove={() => store.map.setState({ top: null })}
          />
          <Field.Img
            label="Lighting"
            addFiles={(fileList) => addMapFiles(fileList, "lighting")}
            file={lighting}
            onRemove={() => store.map.setState({ lighting: null })}
          />
        </Field.Container>
      </Modal>
    </>
  );
};

export const LoadMap = () => {
  const init = store.map.use.init();
  const mapList = store.map.use.mapList();
  const loadModalOpen = store.map.use.loadModalOpen();
  const resetMap = store.map.use.resetMap();
  loadModalOpen && init("editor");

  return (
    <>
      <Button block onClick={() => store.map.setState({ loadModalOpen: !loadModalOpen })}>
        Load
      </Button>
      <Modal
        title="Load Map"
        open={loadModalOpen}
        footer={null}
        onCancel={() => store.map.setState({ loadModalOpen: !loadModalOpen })}
      >
        {mapList.map((map) => (
          <MapItem key={map.id} onClick={() => store.map.setState({ ...map, map })}>
            {map.name}
          </MapItem>
        ))}
      </Modal>
    </>
  );
};

export const MapInfo = () => {
  const map = store.map.use.map();

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
          <Popconfirm
            title="Are you sure？"
            placement="bottomRight"
            onConfirm={() => store.map.setState({ map: null })}
          >
            <a href="#">Close</a>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};
export const MapConfig = () => {
  const dayNight = store.map((state) => state.config?.dayNight);
  return (
    <Card title="Options" size="small">
      <OptionList>
        <div className="option-item">
          <span>Day Night Mode</span>
          <Switch checked={dayNight} onChange={() => store.map.setState({ config: { dayNight: !dayNight } })} />
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
