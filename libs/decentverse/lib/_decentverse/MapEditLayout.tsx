"use client";
import { AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { DataEditModal, Dropdown } from "@shared/client";
import { Map, Tile } from "../../client";
import { fetch, st } from "@decentverse/client";

interface MapEditLayoutProps {
  map: fetch.Map;
  modules?: fetch.EditModuleType[];
}

export const MapEditLayout = ({ modules = [], map }: MapEditLayoutProps) => {
  const moduleLayerView: { [key: string]: boolean } = modules.reduce(
    (acc, cur) => ({ ...acc, [cur.key]: cur.layerView }),
    {}
  );
  const moduleEditTool = modules.map((module) => ({
    key: module.key,
    select: module.select,
    edit: module.edit,
    modal: module.modal,
  }));
  const modulePreview = modules.map((module) => ({
    key: module.key,
    preview: module.preview,
  }));
  const moduleWorld = modules.map((module) => ({ key: module.key, world: module.world }));

  return (
    <div className="bg-slate-300">
      <div className="absolute top-0 left-0 right-0 flex justify-end w-full gap-2 p-2 text-right">
        <div className="">
          <button className="gap-2 btn" onClick={() => st.do.newTile({ map })}>
            <AiOutlinePlus />
            Create Tile
          </button>
          <DataEditModal sliceName="tile">
            <Tile.Edit.General />
          </DataEditModal>
        </div>
        <Dropdown
          buttonClassName="btn btn-circle"
          value={<AiOutlineEye />}
          content={<Map.Util.LayerView moduleLayerView={moduleLayerView} />}
        />
      </div>
      <div className="absolute top-0 left-0 h-full bg-slate-700 min-w-[25%] ">
        <DataEditModal type="form" className="h-full" sliceName="map" renderSubmit={false} renderCancel={false}>
          <Map.Edit.Tool moduleEditTool={moduleEditTool} map={map} />
        </DataEditModal>
      </div>
    </div>
  );
};
