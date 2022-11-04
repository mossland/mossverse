import { Spin } from "antd";
import styled from "styled-components";

export const GameLoading = ({}) => {
  // const percentage = useWorld((state) => state.percentage);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100vh",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 10,
      }}
    >
      <div>
        <Spin size="large" />
        <p style={{}}>Connecting...</p>
        {/* <Progress percent={percentage()} /> */}
      </div>
    </div>
  );
};

const AppContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  z-index: 10px;
  @media screen and (max-width: 800px) {
    /* overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    overscroll-behavior: none; */
  }
`;
