"use client";
import { DataPagination } from "@shared/client";
import { EditPosition } from "../../client";
import { Vector3 } from "three";
import { loader, st, usePage } from "@decentverse/client";

interface GeneralProps {
  placementId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ placementId = undefined }: GeneralProps) => {
  const placementForm = st.use.placementForm();
  const { l } = usePage();
  return (
    <>
      <div className="flex items-center mb-4">
        <EditPosition
          wh={placementForm.wh}
          center={placementForm.center}
          setCenter={st.do.setCenterOnPlacement}
          setWh={st.do.setWhOnPlacement}
        />
      </div>
      {/* <LoadItems
        className="grid grid-cols-3 gap-4"
        sliceName="asset"
        init={{ limit: 30 }}
        renderItem={(asset: fetch.LightAsset) => (
          <Asset.Unit.Admin
            className={`${placementForm.asset?.id === asset.id && "bg-[#ddd] rounded-[30px] h-36"}`}
            asset={asset}
            onClick={() => st.do.newPlacement({ asset, wh: [asset.wh[0], asset.wh[1]] })}
          />
        )}
      /> */}
      <DataPagination sliceName="asset" />
    </>
  );
};
export const Preview = () => {
  const placementForm = st.use.placementForm();
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
