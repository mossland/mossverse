import { Input } from "antd";
import { gql, st, slice, useLocale, loader } from "@decentverse/data-access";
import { DataPagination, Editor, LoadItems, OnlyAdmin } from "@shared/ui-web";
import { useRef } from "react";
import { Mesh, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { AreaBox, Asset, EditPosition, Layer } from "..";
import { useTexture } from "@react-three/drei";

interface PlacementEditProps {
  placementId?: string | null;
  slice?: slice.PlacementSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const PlacementEdit = ({ slice = st.slice.placement, placementId = undefined }: PlacementEditProps) => {
  const placementForm = slice.use.placementForm();
  const { l } = useLocale();
  return (
    <>
      <div className="flex items-center mb-4">
        <EditPosition
          wh={placementForm.wh}
          center={placementForm.center}
          setCenter={slice.do.setCenterOnPlacement}
          setWh={slice.do.setWhOnPlacement}
        />
      </div>
      <LoadItems
        className="grid grid-cols-3 gap-4"
        slice={st.slice.asset}
        init={{ limit: 30 }}
        renderItem={(asset: gql.LightAsset, idx) => (
          <Asset.Item
            className={`${placementForm.asset?.id === asset.id && "bg-[#ddd] rounded-[30px] h-36"}`}
            asset={asset}
            idx={idx}
            onClick={() => st.do.newPlacement({ asset, wh: [asset.wh[0], asset.wh[1]] })}
          />
        )}
      />
      <DataPagination slice={st.slice.asset} />
    </>
  );
};
const PlacementEditPreview = ({ slice = st.slice.placement }: PlacementEditProps) => {
  const placementForm = slice.use.placementForm();
  const center = st.sel((state) => state.placementForm.center);
  const wh = st.sel((state) => state.placementForm.wh);
  const top = placementForm.asset?.top && loader.load(placementForm.asset.top.url);
  const bottom = placementForm.asset?.bottom && loader.load(placementForm.asset.bottom.url);
  const wall = placementForm.asset?.wall && loader.load(placementForm.asset.wall.url);
  const lighting = placementForm.asset?.lighting && loader.load(placementForm.asset.lighting.url);
  return (
    <mesh position={new Vector3(...center, 0.1)}>
      {/* {placementForm.asset?.bottom && <Layer file={placementForm.asset.bottom} wh={wh} opacity={0.5} />}
      {placementForm.asset?.wall && <Layer file={placementForm.asset.wall} wh={wh} opacity={0.5} />}
      {placementForm.asset?.top && <Layer file={placementForm.asset.top} wh={wh} opacity={0.5} />}
      {placementForm.asset?.lighting && (
        <Layer file={placementForm.asset.lighting} center={center} wh={wh} opacity={0.5} />
      )} */}

      {bottom && (
        <mesh>
          <planeGeometry args={wh} />
          <meshBasicMaterial map={bottom} transparent opacity={0.5} />
        </mesh>
      )}

      {wall && (
        <mesh>
          <planeGeometry args={wh} />
          <meshBasicMaterial map={wall} transparent opacity={0.5} />
        </mesh>
      )}

      {top && (
        <mesh>
          <planeGeometry args={wh} />
          <meshBasicMaterial map={top} transparent opacity={0.5} />
        </mesh>
      )}
      {lighting && (
        <mesh>
          <planeGeometry args={wh} />
          <meshBasicMaterial map={lighting} transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};
PlacementEdit.Preview = PlacementEditPreview;
