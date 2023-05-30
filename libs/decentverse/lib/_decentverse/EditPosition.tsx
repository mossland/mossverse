"use client";
import { Input } from "@shared/client";

interface EditPositionProps {
  center: [number, number];
  wh: [number, number];
  setCenter: (center: [number, number]) => void;
  setWh: (center: [number, number]) => void;
}

export const EditPosition = ({ center, wh, setCenter, setWh }: EditPositionProps) => {
  return (
    <div className="block w-full ">
      <div className="block">
        <div>{"center (x, y)"}</div>
        <Input.Number className="mx-2" value={center[0]} onChange={(number) => setCenter([number, center[1]])} />
        <Input.Number className="mx-2" value={center[1]} onChange={(number) => setCenter([center[0], number])} />
      </div>
      <div className="block">
        <div>{"width,weight"}</div>
        <Input.Number className="mx-2" value={wh[0]} onChange={(number) => setWh([number, wh[1]])} />
        <Input.Number className="mx-2" value={wh[1]} onChange={(number) => setWh([wh[0], number])} />
      </div>
    </div>
  );
};
