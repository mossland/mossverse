import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm } from "antd";
import { assetStore, mapStore, types } from "../../stores";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";

export const Assets = () => {
  const init = assetStore.use.init();
  const assets = assetStore.use.assets();
  const modalOpen = assetStore.use.modalOpen();
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Header>
        <h2>Assets</h2>
        <Button onClick={() => assetStore.setState({ ...types.defaultAsset, modalOpen: true })} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={assets}
        renderItem={(asset) => <Asset key={asset.id} asset={asset} />}
      ></List>
      <AssetEdit />
    </div>
  );
};

interface AssetProps {
  asset: types.Asset;
}
export const Asset = React.memo(({ asset }: AssetProps) => {
  const remove = assetStore.use.remove();
  return (
    <Card
      hoverable
      cover={<Img.Stack srcs={[asset.bottom?.url, asset.top?.url, asset.lighting?.url]} width={200} />}
      actions={[
        <EditOutlined key="edit" onClick={() => assetStore.setState({ ...asset, modalOpen: true })} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => remove(asset.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={asset.name} />
    </Card>
  );
});
export const AssetEdit = () => {
  const addAssetFiles = assetStore.use.addAssetFiles();
  const modalOpen = assetStore.use.modalOpen();
  const id = assetStore.use.id();
  const name = assetStore.use.name();
  const top = assetStore.use.top();
  const bottom = assetStore.use.bottom();
  const lighting = assetStore.use.lighting();
  const purify = assetStore.use.purify();
  const create = assetStore.use.create();
  const update = assetStore.use.update();
  return (
    <Modal
      title="New Map"
      open={modalOpen}
      onOk={() => (id ? update() : create())}
      onCancel={() => assetStore.setState({ modalOpen: !modalOpen })}
      okButtonProps={{ disabled: !purify() }}
    >
      <Field.Container>
        <Field.Text label="Name" value={name} onChange={(name) => assetStore.setState({ name })} />
        <Field.Img
          label="Bottom"
          onChange={(fileList) => addAssetFiles(fileList, "bottom")}
          value={bottom}
          onRemove={() => assetStore.setState({ bottom: null })}
        />
        <Field.Img
          label="Top"
          onChange={(fileList) => addAssetFiles(fileList, "top")}
          value={top}
          onRemove={() => assetStore.setState({ top: null })}
        />
        <Field.Img
          label="Lighting"
          onChange={(fileList) => addAssetFiles(fileList, "lighting")}
          value={lighting}
          onRemove={() => assetStore.setState({ lighting: null })}
        />
      </Field.Container>
    </Modal>
  );
};

interface AssetPreviewProps {
  mouse: MutableRefObject<types.Mouse>;
}
const loader = new TextureLoader();
export const AssetPreview = React.memo(({ mouse }: AssetPreviewProps) => {
  const loader = new TextureLoader();
  const asset = assetStore.use.asset();
  const placements = mapStore.use.placements();
  const bottom = asset?.bottom && loader.load(asset.bottom.url);
  const top = asset?.top && loader.load(asset.top.url);
  const lighting = asset?.lighting && loader.load(asset.lighting.url);
  const reset = assetStore.use.reset();
  const update = mapStore.use.update();
  const preview = useRef<Mesh>(null);
  useFrame(() => {
    if (!preview.current || !asset) return;
    preview.current.position.copy(mouse.current);
  });

  if (!asset) return <></>;
  const handleWheel = (e: ThreeEvent<WheelEvent> | any) => {
    if (!e.shiftKey) return;
    const delta = e.deltaY > 1 ? 0.9 : e.deltaY < -1 ? 1.1 : 0;
    assetStore.setState({
      asset: { ...asset, wh: [Math.floor(asset.wh[0] * delta), Math.floor(asset.wh[1] * delta)] },
    });
  };
  const handleClick = async (e: ThreeEvent<MouseEvent> | any) => {
    if (!placements) return;
    mapStore.setState({
      placements: [
        ...placements,
        { id: "", asset, center: [Math.floor(mouse.current.x), Math.floor(mouse.current.y)], wh: asset.wh },
      ],
    });
    reset();
    await update();
  };
  return (
    <Suspense fallback={null}>
      <mesh ref={preview} position={[mouse.current.x, mouse.current.y, 3]}>
        {bottom && (
          <mesh onWheel={handleWheel} onClick={handleClick}>
            <planeGeometry args={asset.wh} />
            <meshBasicMaterial map={bottom} transparent opacity={0.5} />
          </mesh>
        )}
        {top && (
          <mesh onWheel={!bottom ? handleWheel : undefined} onClick={!bottom ? handleClick : undefined}>
            <planeGeometry args={asset.wh} />
            <meshBasicMaterial map={top} transparent opacity={0.5} />
          </mesh>
        )}
        {lighting && (
          <mesh onWheel={!top && !bottom ? handleWheel : undefined} onClick={!top && !bottom ? handleClick : undefined}>
            <planeGeometry args={asset.wh} />
            <meshBasicMaterial map={lighting} transparent opacity={0.5} />
          </mesh>
        )}
      </mesh>
    </Suspense>
  );
});

export const AssetList = () => {
  useEffect(() => {
    init();
  }, []);
  const init = assetStore.use.init();
  const asset = assetStore.use.asset();
  const assets = assetStore.use.assets();
  return (
    <>
      {assets.map((ast) => (
        <AssetItem key={ast.id} asset={ast} active={asset?.id === ast.id} />
      ))}
    </>
  );
};
interface AssetItemProps {
  asset: types.Asset;
  active?: boolean;
  onRemove?: () => void;
}
const AssetItem = React.memo(({ asset, active, onRemove }: AssetItemProps) => {
  return (
    <Card>
      <AssetItemBox onClick={() => assetStore.setState({ asset })} className={active ? "active" : ""}>
        {asset.bottom?.url && <img alt="bottom" src={asset.bottom.url} />}
        {asset.top?.url && <img alt="top" src={asset.top.url} />}
        {asset.lighting?.url && <img alt="lighting" src={asset.lighting.url} />}
      </AssetItemBox>
      <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
        delete
      </Button>
    </Card>
  );
});
interface PlacementsProp {
  placements?: types.Placement[] | null;
}
export const Placements = ({ placements = mapStore.use.placements() }: PlacementsProp) => {
  return (
    <Suspense fallback={null}>
      {placements?.map((placement, idx) => (
        <Placement key={idx} placement={placement} />
      ))}
    </Suspense>
  );
};

export interface PlacementProp {
  placement: types.Placement;
}

export const Placement = React.memo(({ placement }: PlacementProp) => {
  const bottom = placement.asset.bottom && loader.load(placement.asset.bottom.url);
  const top = placement.asset.top && loader.load(placement.asset.top.url);
  const lighting = placement.asset.lighting && loader.load(placement.asset.lighting.url);
  const position = new Vector3(...placement.center, -0.00000005);
  const topPos = new Vector3(...placement.center, 0.00001);
  const lightPos = new Vector3(...placement.center, 0.0001);
  const views = mapStore((state) => state.views);
  return (
    <Suspense fallback={null}>
      {views.includes("asset.bottom") && bottom && (
        <mesh position={position} visible={true}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={bottom} transparent />
        </mesh>
      )}
      {views.includes("asset.top") && top && (
        <mesh position={topPos}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={top} transparent />
        </mesh>
      )}
      {views.includes("asset.lighting") && lighting && (
        <mesh position={lightPos}>
          <planeGeometry args={placement.wh} />
          <meshBasicMaterial map={lighting} transparent />
        </mesh>
      )}
    </Suspense>
  );
});

export const PlacementList = () => {
  const placements = mapStore.use.placements();
  const pointer = mapStore.use.pointer();
  const update = mapStore.use.update();
  if (!placements) return <></>;
  const targets = placements.filter((placement) => Utils.isIn(pointer, placement));
  const handleRemove = async (placement: types.Placement) => {
    mapStore.setState({ placements: placements.filter((p) => p !== placement) });
    await update();
  };
  return (
    <>
      {targets.map((placement) => (
        <AssetItem key={placement.id} asset={placement.asset} onRemove={() => handleRemove(placement)} />
      ))}
    </>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 60px 0 10px 0;
  h2 {
    font-size: 20px;
  }
`;

const AssetItemBox = styled.div`
  position: relative;
  height: 200px;
  cursor: pointer;
  &.active {
    background-color: #ddd;
    border-radius: 30px;
  }
  img {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 190px;
    max-width: 190px;
  }
`;
