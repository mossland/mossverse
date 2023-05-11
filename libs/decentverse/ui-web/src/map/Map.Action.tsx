import { CheckCircleOutlined, NumberOutlined } from "@ant-design/icons";
import { Editor, RecentTime, Checkbox } from "@shared/ui-web";
import { gql, slice, st, useLocale } from "@decentverse/data-access";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";
import Image from "next/image";
import { useInterval } from "@shared/util-client";
import dayjs from "dayjs";
import { Vector3 } from "three";

interface LayerViewProps {
  className?: string;
  slice?: slice.MapSlice;
}
export const LayerView = ({ className, slice = st.slice.map }: LayerViewProps) => {
  const mapLayerView = st.use.mapLayerView();
  const layers = Object.keys(gql.mapEditorLayerView);
  return (
    <div className={twMerge(` `, className)}>
      {layers.map((layer) =>
        typeof mapLayerView[layer] === "boolean" ? (
          <div key={layer}>
            <Checkbox
              onChange={(e) => st.set((state) => (state.mapLayerView[layer] = e.target.checked))}
              checked={mapLayerView[layer]}
            >
              {layer}
            </Checkbox>
          </div>
        ) : (
          <div key={layer}>
            <Checkbox
              onChange={() => {
                const allChecked = Object.keys(mapLayerView[layer]).every((view) => mapLayerView[layer][view]);
                st.set((state) =>
                  Object.keys(mapLayerView[layer]).forEach((view) => (state.mapLayerView[layer][view] = !allChecked))
                );
              }}
              checked={Object.keys(mapLayerView[layer]).every((view) => mapLayerView[layer][view])}
            >
              {layer}
            </Checkbox>
            <div className="flex flex-col ml-4">
              {Object.keys(mapLayerView[layer]).map((view) => (
                <div key={view}>
                  <Checkbox
                    onChange={(e) => st.set((state) => (state.mapLayerView[layer][view] = e.target.checked))}
                    checked={mapLayerView[layer][view]}
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
  map: gql.Map;
  children: (JSX.Element | null | boolean)[];
}

export const Splash = ({ map, children }: SplashProps) => {
  return (
    <div
      className={`absolute right-0 left-0 top-0 bottom-0 flex flex-col items-center justify-center text-center bg-black color-white w-full h-screen text-[50px] bg-cover bg-center overflow-hidden overscroll-none`}
    >
      <Image
        className="absolute object-cover w-full h-full"
        src={map.splash?.url ?? "/public/logo/platform_bg.png"}
        fill
        alt="bg"
      />
      <Image
        src={map.logo?.url ?? "/logo/platform_logo.png"}
        width={800}
        height={300}
        className="mb-[30px] w-5/6 object-scale-down mt-[120px] md:mt-0  drop-shadow-[0_0_10px_rgba(0,0,0,0.7)] opacity-0 animate-mainLogo"
        alt="logo"
      />
      {children}
    </div>
  );
};

export const Daylight = ({ map }: { map: gql.Map }) => {
  const mapDaylight = st.use.mapDaylight();
  useInterval(() => {
    const hour = dayjs().get("hour");
    st.set({ mapDaylight: hour < 20 && hour > 6 ? "day" : "night" });
  }, 600000);
  const center = [map.wh[0] / 2, map.wh[1] / 2];
  if (mapDaylight === "day" || !map.config.dayNight) return <></>;
  return (
    <mesh position={new Vector3(...center, 0.00009)}>
      <planeGeometry attach="geometry" args={map.wh} />
      <meshPhongMaterial attach="material" color={0x233559} opacity={0.4} transparent={true} />
    </mesh>
  );
};
