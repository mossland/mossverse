"use client";
import * as Map from "./_client";
import { AiOutlineHeatMap, AiOutlineWarning } from "react-icons/ai";
import { Checkbox, DataDashboard, Image } from "@shared/client";
import { DataMenuItem, ModelDashboardProps, useInterval } from "@util/client";
import { Vector3 } from "three";
import { fetch, st } from "@decentverse/client";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";
import dayjs from "dayjs";

export const Menu: DataMenuItem = {
  key: "map",
  label: "Map",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Map.Zone.Admin />,
};

export const MenuEditor: DataMenuItem = {
  key: "mapEditor",
  label: "Map Editor",
  icon: <AiOutlineHeatMap />,
  render: () => <Map.Zone.Editor />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "map",
  queryMap = fetch.mapQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.MapSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalMap"]}
      hidePresents={hidePresents}
    />
  );
};

interface LayerViewProps {
  className?: string;
  moduleLayerView?: { [key: string]: boolean };
}
export const LayerView = ({ className, moduleLayerView }: LayerViewProps) => {
  const mapLayerView = st.use.mapLayerView();
  const mergeLayerView = { ...mapLayerView, ...moduleLayerView };
  const layers = Object.keys({ ...fetch.mapEditorLayerView, ...moduleLayerView });

  useEffect(() => {
    st.set((state) => (state.mapLayerView = mergeLayerView));
  }, []);
  return (
    <div className={twMerge(` `, className)}>
      {layers.map((layer) =>
        typeof mergeLayerView[layer] === "boolean" ? (
          <div key={layer}>
            <Checkbox
              onChange={(e) => st.set((state) => (state.mapLayerView[layer] = e.target.checked))}
              checked={mergeLayerView[layer]}
            >
              {layer}
            </Checkbox>
          </div>
        ) : (
          <div key={layer}>
            <Checkbox
              onChange={() => {
                const allChecked = Object.keys(mergeLayerView[layer]).every((view) => mapLayerView[layer][view]);
                st.set((state) =>
                  Object.keys(mergeLayerView[layer]).forEach((view) => (state.mapLayerView[layer][view] = !allChecked))
                );
              }}
              checked={Object.keys(mergeLayerView[layer]).every((view) => mapLayerView[layer][view])}
              // checked={Object.keys(mapLayerView[layer]).every((view) => mapLayerView[layer][view])}
            >
              {layer}
            </Checkbox>
            <div className="flex flex-col ml-4">
              {Object.keys(mergeLayerView[layer]).map((view) => (
                <div key={view}>
                  <Checkbox
                    onChange={(e) => st.set((state) => (state.mapLayerView[layer][view] = e.target.checked))}
                    checked={mergeLayerView[layer][view]}
                  >
                    {layer}.{view}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};
interface SplashProps {
  map: fetch.Map;
  children: (JSX.Element | null | boolean)[];
}

export const Splash = ({ map, children }: SplashProps) => {
  return (
    <div
      className={`absolute right-0 left-0 top-0 bottom-0 flex flex-col items-center justify-center text-center bg-black color-white w-full h-screen text-[50px] bg-cover bg-center overflow-hidden overscroll-none`}
    >
      <Image className="absolute object-cover w-full h-full" src={map.splash?.url ?? "/public/logo/platform_bg.png"} />
      <div className="relative w-[800px] h-[300px] mt-[120px] md:mt-0  drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] ">
        <Image src={map.logo?.url ?? "/logo/platform_logo.png"} className="mb-[30px] object-cover w-full h-full  " />
      </div>
      {children}
    </div>
  );
};
interface DaylightProps {
  wh: [number, number];
  dayNight?: boolean;
}
export const Daylight = ({ wh, dayNight }: DaylightProps) => {
  const mapDaylight = st.use.mapDaylight();
  useInterval(() => {
    const hour = dayjs().get("hour");
    st.set({ mapDaylight: hour < 20 && hour > 6 ? "day" : "night" });
  }, 600000);
  const center = [wh[0] / 2, wh[1] / 2];
  if (mapDaylight === "day" || !dayNight) return <></>;
  return (
    <mesh position={new Vector3(...center, 0.00009)}>
      <planeGeometry attach="geometry" args={wh} />
      <meshPhongMaterial attach="material" color={0x233559} opacity={0.4} transparent={true} />
    </mesh>
  );
};
