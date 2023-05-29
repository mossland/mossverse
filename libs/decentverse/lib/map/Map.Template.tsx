"use client";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { CallRoom, Collision, Live, Placement, Teleport, Webview } from "../../client";
import { Card, DataEditModal, Field, Menu, Select } from "@shared/client";
import { ReactNode, useEffect } from "react";
import { Utils } from "@util/client";
import { fetch, st, usePage } from "@decentverse/client";

interface GeneralProps {
  mapId?: string | null;
}

export const General = ({ mapId = undefined }: GeneralProps) => {
  const mapForm = st.use.mapForm();
  const { l } = usePage();
  return (
    <>
      <Field.Text label="Name" value={mapForm.name} onChange={st.do.setNameOnMap} />
      <Field.Img
        label="logo"
        file={mapForm.logo}
        onRemove={() => st.do.setLogoOnMap(null)}
        addFiles={st.do.uploadLogoOnMap}
      />
      <Field.Img
        label="splash"
        file={mapForm.splash}
        onRemove={() => st.do.setSplashOnMap(null)}
        addFiles={st.do.uploadSplashOnMap}
      />
      <Field.Img
        label="miniView"
        file={mapForm.miniView}
        onRemove={() => st.do.setMiniViewOnMap(null)}
        addFiles={st.do.uploadMiniViewOnMap}
      />
      {mapForm.spawnPositions.map((spawnPosition, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex gap-1">
            key:
            <input
              value={spawnPosition.key}
              onChange={(e) => st.do.writeOnMap(["spawnPositions", idx, "key"], e.target.value)}
            />
          </div>
          <Field.DoubleNumber
            label="position"
            value={spawnPosition.position}
            onChange={(position) => st.do.writeOnMap(["spawnPositions", idx, "position"], position)}
          />
          <button className="btn" onClick={() => st.do.subSpawnPositionsOnMap(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn" onClick={() => st.do.addSpawnPositionsOnMap(fetch.defaultMapPosition)}>
        + Add SpawnPosition
      </button>
    </>
  );
};

type ModuleEditToolType = {
  key: string;
  select: ReactNode;
  edit: ReactNode;
  modal: ReactNode;
};

interface ToolProps {
  map: fetch.Map;
  moduleEditTool?: ModuleEditToolType[];
}

export const Tool = ({ map, moduleEditTool }: ToolProps) => {
  const mapModal = st.use.mapModal();
  const placementSelection = st.use.placementSelection();
  const collisionSelection = st.use.collisionSelection();
  const webviewSelection = st.use.webviewSelection();
  const callRoomSelection = st.use.callRoomSelection();
  const liveSelection = st.use.liveSelection();
  const teleportSelection = st.use.teleportSelection();
  const mousePosition = st.use.mousePosition();
  const menus = [...fetch.interactions, ...(moduleEditTool ? moduleEditTool.map((editor) => editor.key) : [])] as const;
  return (
    <div
      className="h-full overflow-hidden"
      onMouseLeave={() => mousePosition !== "map" && st.do.setMousePosition("map")}
      onMouseEnter={() => mousePosition !== "interface" && st.do.setMousePosition("interface")}
      onClick={() => mousePosition !== "interface" && st.do.setMousePosition("interface")}
    >
      <Menu
        className="mb-[10px] w-full justify-center"
        mode="horizontal"
        defaultSelectedKeys={[]}
        onClick={({ key }) => {
          console.log(key);
          st.set({ mapModal: key });
          if (mapModal && key !== "collision" && fetch.interactions.includes(mapModal as any))
            st.do[`reset${Utils.capitalize(mapModal)}`]();
          if (key === "collision") st.do.newCollision({ map });
        }}
        items={[
          {
            key: "select",

            label: (
              <div className="flex items-center p-3 text-black bg-white border rounded-md">
                <AiOutlineSearch />
                Select
              </div>
            ),
          },
          {
            key: "collision",
            label: (
              <div className="flex items-center p-3 text-black bg-green-200 border rounded-md">
                <AiOutlineEdit />
                Add
              </div>
            ),
          },
        ]}
      />
      {mapModal && menus.includes(mapModal as any) && (
        <div className="w-full p-5 grow">
          <Card title="Interaction" className="w-full bg-white">
            <Select
              // className="grid grid-cols-3"
              value={mapModal}
              onChange={(value) => {
                console.log(Utils.capitalize(value));
                st.do[`reset${Utils.capitalize(mapModal)}`]();
                st.do[`new${Utils.capitalize(value)}`]({ map });
                st.do.setMapModal(value);
              }}
            >
              {menus.map((interaction) => (
                <Select.Option key={interaction} value={interaction}>
                  {Utils.capitalize(interaction)}
                </Select.Option>
              ))}
            </Select>
            {mapModal === "placement" && <Placement.Edit.General />}
            {mapModal === "collision" && <Collision.Edit.General />}
            {mapModal === "webview" && <Webview.Edit.General />}
            {mapModal === "live" && <Live.Edit.General />}
            {mapModal === "callRoom" && <CallRoom.Edit.General />}
            {mapModal === "teleport" && <Teleport.Edit.General />}
            {moduleEditTool &&
              moduleEditTool.length &&
              moduleEditTool.map((editTool) => editTool.key === mapModal && editTool.edit)}
          </Card>
        </div>
      )}
      {mapModal === "select" && (
        <div className="flex flex-col w-full h-auto gap-2 px-2 overflow-y-scroll scrollbar-thin scrollbar-track-transparent ">
          {placementSelection.map((placement, idx) => (
            <Placement.Unit.Admin className="bg-white" placement={placement} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="placement" renderTitle={(placement: fetch.LightPlacement) => `${placement.id}`}>
            <Placement.Edit.General />
          </DataEditModal>
          {collisionSelection.map((collision, idx) => (
            <Collision.Unit.Admin className="bg-white" collision={collision} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="collision" renderTitle={(collision: fetch.LightCollision) => `${collision.id}`}>
            <Collision.Edit.General />
          </DataEditModal>
          {webviewSelection.map((webview, idx) => (
            <Webview.Unit.Admin className="bg-white" webview={webview} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="webview" renderTitle={(webview: fetch.LightWebview) => `${webview.id}`}>
            <Webview.Edit.General />
          </DataEditModal>
          {callRoomSelection.map((callRoom, idx) => (
            <CallRoom.Unit.Admin className="bg-white" callRoom={callRoom} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="callRoom" renderTitle={(callRoom: fetch.LightCallRoom) => `${callRoom.id}`}>
            <CallRoom.Edit.General />
          </DataEditModal>
          {liveSelection.map((live, idx) => (
            <Live.Unit.Admin live={live} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="live" renderTitle={(live: fetch.LightLive) => `${live.id}`}>
            <Live.Edit.General />
          </DataEditModal>
          {teleportSelection.map((teleport, idx) => (
            <Teleport.Unit.Admin className="bg-white" teleport={teleport} actions={["edit", "remove"]} />
          ))}
          <DataEditModal sliceName="teleport" renderTitle={(teleport: fetch.LightTeleport) => `${teleport.id}`}>
            <Teleport.Edit.General />
          </DataEditModal>
          {moduleEditTool &&
            moduleEditTool.length &&
            moduleEditTool.map((editTool) => (
              <>
                {editTool.select}
                {editTool.modal}
              </>
            ))}

          {/* {mapModules && mapModules.length && mapModules.map((editor) => editor.key === mapModal && editor.list)} */}
        </div>
      )}
    </div>
  );
};

type modulePreviewType = {
  key: string;
  preview: ReactNode;
};
interface WorldProps {
  map: fetch.Map;
}

export const World = ({ map }: WorldProps) => {
  const mapModal = st.use.mapModal();
  const mousePosition = st.use.mousePosition();
  const collisionModal = st.use.collisionModal();
  const placementModal = st.use.placementModal();
  const webviewModal = st.use.webviewModal();
  const liveModal = st.use.liveModal();
  const callRoomModal = st.use.callRoomModal();
  const teleportModal = st.use.teleportModal();
  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      console.log("mapModal", mapModal, "mousePosition", mousePosition);
      mapModal &&
        e.key === "Escape" &&
        fetch.interactions.includes(mapModal as fetch.Interaction) &&
        st.do[`new${Utils.capitalize(mapModal)}`]({ map, center: [], wh: [] });
    };
    window.addEventListener("keydown", cancel);
    return () => {
      window.removeEventListener("keydown", cancel);
    };
  }, []);
  return (
    <>
      {mapModal === "placement" && placementModal === "edit" && <Placement.Edit.Preview />}
      {mapModal === "collision" && collisionModal === "edit" && <Collision.Edit.Preview />}
      {mapModal === "webview" && webviewModal === "edit" && <Webview.Edit.Preview />}
      {mapModal === "live" && liveModal === "edit" && <Live.Edit.Preview />}
      {mapModal === "callRoom" && callRoomModal === "edit" && <CallRoom.Edit.Preview />}
      {mapModal === "teleport" && teleportModal === "edit" && <Teleport.Edit.Preview />}
    </>
  );
};
