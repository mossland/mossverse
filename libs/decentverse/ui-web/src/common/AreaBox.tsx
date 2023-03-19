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
    <div className="flex justify-center items-center w-full h-[100px]">
      <div
        className="relative border border-black"
        style={{ backgroundColor: color, width: getWh()[0], height: getWh()[1] }}
      >
        <span className="absolute left-1/2 text-[10px] translate-x-[-50%] translate-y-[-100%]">
          {wh[0]?.toFixed(4)}
        </span>
        <span className="absolute top-1/2 right-0 text-[10px] translate-x-[120%] translate-y-[-50%]">
          {wh[1]?.toFixed(4)}
        </span>
        <div className="absolute bg-black w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2" />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 pt-4 rounded-full top-1/2 left-1/2">
          <span className="text-[10px] w-full">
            ({center[0]?.toFixed(4)},{center[1]?.toFixed(4)})
          </span>
        </div>
      </div>
    </div>
  );
};
