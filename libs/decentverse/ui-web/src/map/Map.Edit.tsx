import { Menu, Radio } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { DataEditModal, Editor, Field, LoadItems, OnlyAdmin, Card } from "@shared/ui-web";
import { EditOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import { cnst, Utils } from "@shared/util";
import { Asset, CallRoom, Collision, Live, Placement, Teleport, Webview } from "..";
import { useEffect } from "react";

interface MapEditProps {
  mapId?: string | null;
  slice?: slice.MapSlice;
}

export const MapEdit = ({ slice = st.slice.map, mapId = undefined }: MapEditProps) => {
  const mapForm = slice.use.mapForm();
  const { l } = useLocale();
  return (
    <>
      <Field.Text label="Name" value={mapForm.name} onChange={slice.do.setNameOnMap} />
      <Field.Img
        label="logo"
        file={mapForm.logo}
        onRemove={() => slice.do.setLogoOnMap(null)}
        addFiles={slice.do.uploadLogoOnMap}
      />
      <Field.Img
        label="splash"
        file={mapForm.splash}
        onRemove={() => slice.do.setSplashOnMap(null)}
        addFiles={slice.do.uploadSplashOnMap}
      />
      <Field.Img
        label="miniView"
        file={mapForm.miniView}
        onRemove={() => slice.do.setMiniViewOnMap(null)}
        addFiles={slice.do.uploadMiniViewOnMap}
      />
      {mapForm.spawnPositions.map((spawnPosition, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex gap-1">
            key:
            <input
              value={spawnPosition.key}
              onChange={(e) => slice.do.writeOnMap(["spawnPositions", idx, "key"], e.target.value)}
            />
          </div>
          <Field.DoubleNumber
            label="position"
            value={spawnPosition.position}
            onChange={(position) => slice.do.writeOnMap(["spawnPositions", idx, "position"], position)}
          />
          <button className="btn" onClick={() => slice.do.subSpawnPositionsOnMap(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn" onClick={() => slice.do.addSpawnPositionsOnMap(gql.defaultMapPosition)}>
        + Add SpawnPosition
      </button>
    </>
  );
};
interface MapEditToolProps {
  map: gql.Map;
}

const MapEditTool = ({ map }: MapEditToolProps) => {
  const mapModal = st.use.mapModal();
  const placementSelection = st.use.placementSelection();
  const collisionSelection = st.use.collisionSelection();
  const webviewSelection = st.use.webviewSelection();
  const callRoomSelection = st.use.callRoomSelection();
  const liveSelection = st.use.liveSelection();
  const teleportSelection = st.use.teleportSelection();
  return (
    <>
      <Menu
        className="mb-[10px] w-full justify-center"
        mode="horizontal"
        defaultSelectedKeys={[]}
        onSelect={({ key }) => {
          st.set({ mapModal: key });
          // if (mapModal && key !== "collision" && gql.interactions.includes(mapModal as any))
          //   st.do[`reset${Utils.capitalize(mapModal)}`]();
          // if (key === "collision") st.do.newCollision({ map });
        }}
      >
        <Menu.Item key="select" icon={<SearchOutlined />}>
          Select
        </Menu.Item>
        <Menu.Item key="collision" icon={<EditOutlined />}>
          Add
        </Menu.Item>
      </Menu>
      {mapModal && gql.interactions.includes(mapModal as any) && (
        <div className="flex flex-col self-auto overflow-hidden  grow">
          <Card title="Interaction">
            <div className="">
              <Radio.Group
                value={mapModal}
                onChange={(e) => {
                  st.do[`reset${Utils.capitalize(mapModal)}`]();
                  st.do[`new${Utils.capitalize(e.target.value)}`]({ map });
                  st.do.setMapModal(e.target.value);
                }}
                size="small"
                buttonStyle="solid"
                className="w-full"
              >
                {gql.interactions.map((interaction) => (
                  <Radio.Button key={interaction} value={interaction}>
                    {Utils.capitalize(interaction)}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            {mapModal === "placement" && <Placement.Edit />}
            {mapModal === "collision" && <Collision.Edit />}
            {mapModal === "webview" && <Webview.Edit />}
            {mapModal === "live" && <Live.Edit />}
            {mapModal === "callRoom" && <CallRoom.Edit />}
            {mapModal === "teleport" && <Teleport.Edit />}
          </Card>
        </div>
      )}
      {mapModal === "select" && (
        <div className="flex flex-col h-full gap-2 overflow-scroll">
          {placementSelection.map((placement, idx) => (
            <Placement.Item placement={placement} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.placement} renderTitle={(placement: gql.LightPlacement) => `${placement.id}`}>
            <Placement.Edit />
          </DataEditModal>
          {collisionSelection.map((collision, idx) => (
            <Collision.Item collision={collision} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.collision} renderTitle={(collision: gql.LightCollision) => `${collision.id}`}>
            <Collision.Edit />
          </DataEditModal>
          {webviewSelection.map((webview, idx) => (
            <Webview.Item webview={webview} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.webview} renderTitle={(webview: gql.LightWebview) => `${webview.id}`}>
            <Webview.Edit />
          </DataEditModal>
          {callRoomSelection.map((callRoom, idx) => (
            <CallRoom.Item callRoom={callRoom} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.callRoom} renderTitle={(callRoom: gql.LightCallRoom) => `${callRoom.id}`}>
            <CallRoom.Edit />
          </DataEditModal>
          {liveSelection.map((live, idx) => (
            <Live.Item live={live} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.live} renderTitle={(live: gql.LightLive) => `${live.id}`}>
            <Live.Edit />
          </DataEditModal>
          {teleportSelection.map((teleport, idx) => (
            <Teleport.Item teleport={teleport} idx={idx} actions={["edit", "remove"]} />
          ))}
          <DataEditModal slice={st.slice.teleport} renderTitle={(teleport: gql.LightTeleport) => `${teleport.id}`}>
            <Teleport.Edit />
          </DataEditModal>
        </div>
      )}
    </>
  );
};
MapEdit.Tool = MapEditTool;

const MapEditWorld = ({ map }: MapEditToolProps) => {
  const mapModal = st.use.mapModal();
  const collisionModal = st.use.collisionModal();
  const placementModal = st.use.placementModal();
  const webviewModal = st.use.webviewModal();
  const liveModal = st.use.liveModal();
  const callRoomModal = st.use.callRoomModal();
  const teleportModal = st.use.teleportModal();
  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      mapModal &&
        e.key === "Escape" &&
        gql.interactions.includes(mapModal as gql.Interaction) &&
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
MapEdit.World = MapEditWorld;
