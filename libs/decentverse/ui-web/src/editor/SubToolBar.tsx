import styled from "styled-components";
import { Button, Popover, Space, Checkbox } from "antd";
import { store, gql } from "@decentverse/data-access";
import { EyeOutlined } from "@ant-design/icons";

export const SubToolBar = () => {
  return (
    <SubToolBarContainer>
      <Space direction="horizontal">
        <Popover placement="topLeft" title={"View mode"} content={ViewTool} trigger="click">
          <Button shape="circle" icon={<EyeOutlined />} />
        </Popover>
      </Space>
    </SubToolBarContainer>
  );
};
export const ViewTool = () => {
  return (
    <ViewToolContainer>
      <CheckViews title="interaction" views={gql.interactionViews} />
      <CheckViews title="asset" views={gql.assetViews} />
      <CheckView view="live.iframe" />
    </ViewToolContainer>
  );
};
interface CheckViewsProps {
  title: string;
  views: gql.MapView[];
}
const CheckViews = ({ title, views }: CheckViewsProps) => {
  const vs = store.map.use.views();
  const viewAll = vs.some((view) => views.includes(view));
  return (
    <>
      <Checkbox
        onChange={() =>
          store.map.setState({
            views: viewAll ? vs.filter((view) => !views.includes(view)) : [...new Set([...vs, ...views])],
          })
        }
        checked={viewAll}
      >
        {title}
      </Checkbox>
      <div className="sub-list">
        {views.map((view) => (
          <CheckView key={view} view={view} />
        ))}
      </div>
    </>
  );
};
interface CheckViewProps {
  view: gql.MapView;
}
const CheckView = ({ view }: CheckViewProps) => {
  const views = store.map.use.views();
  return (
    <>
      <Checkbox
        onChange={() =>
          store.map.setState({
            views: views.includes(view) ? views.filter((v) => v !== view) : [...views, view],
          })
        }
        checked={views.includes(view)}
      >
        {view}
      </Checkbox>
      <br />
    </>
  );
};
const SubToolBarContainer = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 4px 14px;
  text-align: right;
  z-index: 2;
`;
const ViewToolContainer = styled.div`
  .sub-list {
    margin-left: 20px;
    margin-bottom: 6px;
  }
`;
