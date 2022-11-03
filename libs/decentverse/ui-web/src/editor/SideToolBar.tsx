import styled from "styled-components";
import { Segmented, Menu, Radio, Button, Space } from "antd";
import { EditOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import { store, gql } from "@decentverse/data-access";
import { MapConfig, MapInfo } from "../map";
import { AssetList, PlacementList } from "../asset";
import { InteractionTool } from "./InteractionTool";
import { CollsionList } from "../collision";
import { WebviewList } from "../webview";
import { LiveList } from "../live";
import { CallRoomList } from "../callRoom";

export const SideToolBar = () => {
  const mainTool = store.map.use.mainTool();
  const map = store.map.use.map();
  const editMode = store.map.use.editMode();
  const pointer = store.map.use.pointer();
  return (
    <SideToolBarContainer>
      <MapInfo />
      {map && (
        <>
          <Menu
            className="edit-mode-button"
            mode="horizontal"
            defaultSelectedKeys={[editMode]}
            onSelect={({ key }) => store.map.setState({ editMode: key as gql.EditMode, edit: null })}
          >
            <Menu.Item key="select" icon={<SearchOutlined />}>
              Select
            </Menu.Item>
            <Menu.Item key="add" icon={<EditOutlined />}>
              Add
            </Menu.Item>
            <Menu.Item key="option" icon={<SettingOutlined />}>
              Option
            </Menu.Item>
          </Menu>

          {editMode === "add" && (
            <>
              <Menu
                className="main-tool"
                mode="horizontal"
                defaultSelectedKeys={["Assets"]}
                onSelect={({ key }) => store.map.setState({ mainTool: key as gql.MainTool })}
              >
                <Menu.Item key="assets">Assets</Menu.Item>
                <Menu.Item key="interaction">Interaction</Menu.Item>
                <Menu.Item key="dialog">Dialog</Menu.Item>
              </Menu>

              <div className="tool-container">
                {mainTool === "assets" && <AssetList />}
                {mainTool === "interaction" && <InteractionTool />}
                {/*{mainTool === "dialog" && <DialogList />} */}
              </div>
            </>
          )}
          {editMode === "select" && (
            // <SelectInfo />
            <div className="select-list">
              <PlacementList />
              <CollsionList />
              <WebviewList />
              <LiveList />
              <CallRoomList />
            </div>
          )}
          {editMode === "option" && <MapConfig />}
        </>
      )}
    </SideToolBarContainer>
  );
};

const SideToolBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  padding-top: 50px;

  .edit-mode-button {
    margin-bottom: 10px;
  }
  .tool-container {
    margin-top: 10px;
    flex-grow: 1;
    align-self: auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .select-list {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
