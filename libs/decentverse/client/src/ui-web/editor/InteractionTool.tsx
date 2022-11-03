import styled from "styled-components";
import { Card, Radio } from "antd";
import { mapStore, types } from "../../stores";
import { WebViewEdit } from "../webview";
import { LiveEdit } from "../live";
import { CallRoomEdit } from "../callRoom";

export const InteractionTool = () => {
  const edit = mapStore.use.edit();
  return (
    <Card title="Interaction" size="small">
      <OptionArea>
        <Radio.Group
          value={edit}
          onChange={(e) => mapStore.setState({ edit: e.target.value })}
          size="small"
          buttonStyle="solid"
          className="radio-buttons"
        >
          <Radio.Button value="collision">Collision</Radio.Button>
          <Radio.Button value="webview">WebPage</Radio.Button>
          <Radio.Button value="callRoom">CallRoom</Radio.Button>
          <Radio.Button value="live">Live</Radio.Button>
        </Radio.Group>
      </OptionArea>
      {edit === "webview" && <WebViewEdit />}
      {edit === "live" && <LiveEdit />}
      {edit === "callRoom" && <CallRoomEdit />}
    </Card>
  );
};

const OptionArea = styled.div`
  margin-top: 20px;
  .ant-radio-group {
    margin-bottom: 10px;
  }
  .radio-buttons {
    width: 100%;
    margin-bottom: 20px;
  }
  .ant-radio-button-wrapper {
    width: 33.3333%;
    text-align: center;
  }
`;
