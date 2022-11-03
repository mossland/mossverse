import styled from "styled-components";

interface AreaBoxProps {
  color: string;
  center: [number, number];
  wh: [number, number];
}

export const AreaBox = ({ color, center, wh }: AreaBoxProps) => {
  const getWh = () => {
    const long = Math.max(wh[0], wh[1]);
    return [(wh[0] / long) * 100, (wh[1] / long) * 100];
  };
  return (
    <BoxContainer color={color} width={getWh()[0]} height={getWh()[1]}>
      <div className="box">
        <span className="width">{Math.round(wh[0])}</span>
        <span className="height">{Math.round(wh[1])}</span>
        <div className="dot">
          <span>
            ({Math.round(center[0])},{Math.round(center[1])})
          </span>
        </div>
      </div>
    </BoxContainer>
  );
};

const BoxContainer = styled.div<{ color: string; width: number; height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  .box {
    /* width: 140px;
    height: 80px; */
    width: ${(props) => `${props.width}px`};
    height: ${(props) => `${props.height}px`};
    background-color: ${(props) => props.color};
    position: relative;
    border: 1px solid black;
  }
  .dot {
    width: 3px;
    height: 3px;
    border-radius: 100%;
    background-color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    span {
      font-size: 10px;
    }
  }
  .width {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 10px;
  }
  .height {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(120%, -50%);
    font-size: 10px;
  }
`;
