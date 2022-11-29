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
  const mapForm = store.map.use.mapForm();
  const mapModal = store.map.use.mapModal();
  return (
    <>
      <Button block onClick={() => store.map.do.newMap()}>
        New
      </Button>
      <Modal
        title="New Map"
        open={!!mapModal}
        onOk={store.map.do.createMap}
        onCancel={() => store.map.do.resetMap()}
        okButtonProps={{ disabled: !store.map.do.purifyMap() }}
      >
        <Field.Container>
          <Field.Text label="Name" value={mapForm.name} onChange={store.map.do.setNameOnMap} />
          <Field.Number label="TileSize" value={mapForm.tileSize} onChange={store.map.do.setTileSizeOnMap} required />
          <Field.Img
            label="Bottom"
            addFiles={(fileList) => store.map.do.addMapFiles(fileList, "bottom", store.map.id)}
            file={mapForm.bottom}
            required
            onRemove={() => store.map.do.setBottomOnMap(null)}
          />
          <Field.Img
            label="Top"
            addFiles={(fileList) => store.map.do.addMapFiles(fileList, "top", store.map.id)}
            file={mapForm.top}
            onRemove={() => store.map.do.setTopOnMap(null)}
          />
          <Field.Img
            label="Lighting"
            addFiles={(fileList) => store.map.do.addMapFiles(fileList, "lighting", store.map.id)}
            file={mapForm.lighting}
            onRemove={() => store.map.do.setLightingOnMap(null)}
          />
        </Field.Container>
      </Modal>
    </>
  );
};

export const LoadMap = () => {
  const mapList = store.map.use.mapList();
  const loadModalOpen = store.map.use.loadModalOpen();
  loadModalOpen && store.map.do.init("editor");

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
  const dayNight = store.map((state) => state.mapForm.config?.dayNight);
  return (
    <Card title="Options" size="small">
      <OptionList>
        <div className="option-item">
          <span>Day Night Mode</span>
          <Switch checked={dayNight} onChange={() => store.map.do.setConfigOnMap({ dayNight: !dayNight })} />
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
