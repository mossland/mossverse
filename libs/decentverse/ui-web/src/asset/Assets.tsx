import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ToolOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Button, Table, Space, Input, Radio, Col, Row, Select, List, Card, Popconfirm, Skeleton } from "antd";
import { store, gql } from "@decentverse/data-access";
import { Field, Img } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Mesh, PlaneGeometry, Sprite, TextureLoader, Vector3 } from "three";
import { Utils } from "@shared/util";
interface AssetsProps {
  assetSlice: gql.AssetSlice;
}
export const Assets = ({ assetSlice }: AssetsProps) => {
  const assetList = store.asset.use.assetList();
  const assetModal = store.asset.use.assetModal();
  useEffect(() => {
    store.asset.do.initAsset();
  }, []);

  return (
    <div>
      <Header>
        <h2>Assets</h2>
        <Button onClick={() => store.asset.do.newAsset()} icon={<PlusOutlined />}>
          Add
        </Button>
      </Header>
      {assetList === "loading" ? (
        <Skeleton />
      ) : (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={assetList}
          renderItem={(asset) => <Asset key={asset.id} asset={asset} assetSlice={assetSlice} />}
        />
      )}
      <AssetEdit assetSlice={assetSlice} />
    </div>
  );
};

interface AssetProps {
  asset: gql.LightAsset;
  assetSlice: gql.AssetSlice;
}
export const Asset = React.memo(({ asset }: AssetProps) => {
  return (
    <Card
      hoverable
      cover={<Img.Stack srcs={[asset.bottom?.url, asset.top?.url, asset.lighting?.url]} width={200} />}
      actions={[
        <EditOutlined key="edit" onClick={() => store.asset.do.editAsset(asset.id)} />,
        <Popconfirm title="Are you sure to remove?" onConfirm={() => store.asset.do.removeAsset(asset.id)}>
          <DeleteOutlined key="remove" />
        </Popconfirm>,
      ]}
    >
      <Card.Meta title={asset.name} />
    </Card>
  );
});
interface AssetEditProps {
  assetSlice: gql.AssetSlice;
}
export const AssetEdit = ({ assetSlice }: AssetEditProps) => {
  const addAssetFiles = store.asset.use.addAssetFiles();
  const assetModal = store.asset.use.assetModal();
  const assetForm = store.asset.use.assetForm();
  const assetSumbit = assetSlice.use.assetSubmit();
  useEffect(() => {
    assetSlice.do.checkAssetSubmitable();
  }, [assetForm]);
  return (
    <Modal
      title="New Map"
      open={!!assetModal}
      onOk={assetSlice.do.submitAsset}
      onCancel={() => store.asset.do.resetAsset()}
      okButtonProps={assetSumbit}
    >
      <Field.Container>
        <Field.Text label="Name" value={assetForm.name} onChange={store.asset.do.setNameOnAsset} />
        <Field.Img
          label="Bottom"
          addFiles={(fileList) => store.asset.do.addAssetFiles(fileList, "bottom")}
          file={assetForm.bottom}
          onRemove={() => store.asset.do.setBottomOnAsset(null)}
        />
        <Field.Img
          label="Top"
          addFiles={(fileList) => store.asset.do.addAssetFiles(fileList, "top")}
          file={assetForm.top}
          onRemove={() => store.asset.do.setTopOnAsset(null)}
        />
        <Field.Img
          label="Lighting"
          addFiles={(fileList) => store.asset.do.addAssetFiles(fileList, "lighting")}
          file={assetForm.lighting}
          onRemove={() => store.asset.do.setLightingOnAsset(null)}
        />
      </Field.Container>
    </Modal>
  );
};

interface AssetPreviewProps {
  mouse: MutableRefObject<gql.Mouse>;
}
const loader = new TextureLoader();
export const AssetPreview = React.memo(({ mouse }: AssetPreviewProps) => {
  const loader = new TextureLoader();
  const asset = store.asset.use.asset();
  const placements = store.map((state) => state.mapForm.placements);
  const preview = useRef<Mesh>(null);
  useFrame(() => {
    if (!preview.current || !asset) return;
    preview.current.position.copy(mouse.current);
  });
  if (!asset || asset === "loading") return <></>;
  const bottom = asset?.bottom && loader.load(asset.bottom.url);
  const top = asset?.top && loader.load(asset.top.url);
  const lighting = asset?.lighting && loader.load(asset.lighting.url);
  const handleWheel = (e: ThreeEvent<WheelEvent> | any) => {
    if (!e.shiftKey) return;
    const delta = e.deltaY > 1 ? 0.9 : e.deltaY < -1 ? 1.1 : 0;
    store.asset.setState({
      asset: { ...asset, wh: [Math.floor(asset.wh[0] * delta), Math.floor(asset.wh[1] * delta)] },
    });
  };
  const handleClick = async (e: ThreeEvent<MouseEvent> | any) => {
    if (!placements) return;
    store.map.do.addPlacementsOnMap({
      id: "",
      asset,
      center: [Math.floor(mouse.current.x), Math.floor(mouse.current.y)],
      wh: asset.wh,
    });
    store.asset.do.resetAsset();
    await store.map.do.updateMap();
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
    initAsset();
  }, []);
  const initAsset = store.asset.use.initAsset();
  const asset = store.asset.use.asset();
  const assetList = store.asset.use.assetList();
  return assetList === "loading" ? (
    <Skeleton />
  ) : (
    <>
      {assetList.map((ast) => (
        <AssetItem key={ast.id} asset={ast} active={asset !== "loading" && asset?.id === ast.id} />
      ))}
    </>
  );
};
interface AssetItemProps {
  asset: gql.LightAsset;
  active?: boolean;
  onRemove?: () => void;
}
const AssetItem = React.memo(({ asset, active, onRemove }: AssetItemProps) => {
  return (
    <Card>
      <AssetItemBox
        onClick={() => store.asset.do.selectAsset(asset)}
        // onClick={() => store.asset.do.setAsset(asset)}
        className={active ? "active" : ""}
      >
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
  placements?: gql.Placement[] | null;
}
export const Placements = ({ placements = store.map((state) => state.mapForm.placements) }: PlacementsProp) => {
  return (
    <Suspense fallback={null}>
      {placements?.map((placement, idx) => (
        <Placement key={idx} placement={placement} />
      ))}
    </Suspense>
  );
};

export interface PlacementProp {
  placement: gql.Placement;
}

export const Placement = React.memo(({ placement }: PlacementProp) => {
  const bottom = placement.asset.bottom && loader.load(placement.asset.bottom.url);
  const top = placement.asset.top && loader.load(placement.asset.top.url);
  const lighting = placement.asset.lighting && loader.load(placement.asset.lighting.url);
  const position = new Vector3(...placement.center, -0.00000005);
  const topPos = new Vector3(...placement.center, 0.00001);
  const lightPos = new Vector3(...placement.center, 0.0001);
  const views = store.map((state) => state.views);
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
  const placements = store.map((state) => state.mapForm.placements);
  const pointer = store.map.use.pointer();
  const updateMap = store.map.use.updateMap();
  if (!placements) return <></>;
  const targets = placements.filter((placement) => Utils.isIn(pointer, placement));
  const handleRemove = async (placement: gql.Placement) => {
    store.map.do.setPlacementsOnMap(placements.filter((p) => p !== placement));
    await updateMap();
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
