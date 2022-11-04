import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const CustomIcon = (
  <LoadingOutlined
    style={{
      fontSize: 100,
    }}
    spin
  />
);

export const Pending = () => {
  return (
    <div
      style={{
        zIndex: 2,
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.8)",
        opacity: 1,
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Spin size="large" spinning={true} indicator={CustomIcon}></Spin>
        <p style={{ fontSize: 25 }}>Loading...</p>
      </div>
    </div>
  );
};
