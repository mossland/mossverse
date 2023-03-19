import dynamic from "next/dynamic";
import { st, gql } from "@mossland/frontend/stores";
import { DataEditModal, GqlProvider, LoadItems } from "@shared/ui-web";
import { env } from "@mossland/frontend/env/env";
import { PageMap } from "@shared/util-client";
import { useEffect } from "react";
import Router from "next/router";
import { Popover, Skeleton } from "antd";
import { Asset, Map, Tile } from "@decentverse/ui-web";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { CameraControls, MapControls, OrbitControls } from "@react-three/drei";
// import { }from "@react-three/fiber"
export default function Page() {
  const mapId = Router.query.mapId as string;
  const map = st.use.map();

  useEffect(() => {
    if (!mapId) return;
    st.do.editMap(mapId);
    st.do.setMapLayerView(gql.decentverse.mapEditorLayerView);
  }, [mapId]);
  if (!mapId) return <Skeleton active />;
  return (
    <div className="">
      <div className="absolute top-0 left-0 right-0 flex justify-end w-full gap-2 p-2 text-right bg-white/20">
        {map !== "loading" && (
          <div>
            <button className="gap-2 btn" onClick={() => st.do.newTile({ map })}>
              <PlusOutlined />
              Create Tile
            </button>
            <DataEditModal slice={st.slice.tile}>
              <Tile.Edit />
            </DataEditModal>
          </div>
        )}
        <Popover placement="topLeft" title={"View mode"} content={<Map.Action.LayerView />} trigger="click">
          <button className="btn btn-circle">
            <EyeOutlined />
          </button>
        </Popover>
      </div>
      <div className="absolute top-0 left-0 h-full bg-white/30 w-72">
        <DataEditModal type="form" slice={st.slice.map} onSubmit={() => Router.back()} onCancel={() => Router.back()}>
          {/* <Map.Edit /> */}
          {map !== "loading" && <Map.Edit.Tool map={map} />}
        </DataEditModal>
      </div>
    </div>
  );
}
Page.canvas = (props) => {
  const map = st.use.map();
  return (
    <>
      {map === "loading" ? null : (
        <>
          <Map.View.World map={map} />
          <Map.Edit.World map={map} />
        </>
      )}
      <MapControls enableRotate={false} />
      <CameraControls />
    </>
  );
};
