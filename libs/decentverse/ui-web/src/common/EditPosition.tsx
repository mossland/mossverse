import { useState } from "react";
import { Field } from "@shared/ui-web";
import { Button } from "antd";

interface EditPositionProps {
  center: [number, number];
  wh: [number, number];
  setCenter: (center: [number, number]) => void;
  setWh: (center: [number, number]) => void;
}

export const EditPosition = ({ center, wh, setCenter, setWh }: EditPositionProps) => {
  return (
    <div>
      <Field.Container>
        <Field.DoubleNumber label="center (x, y)" value={center} onChange={(numbers) => setCenter(numbers)} />
        <Field.DoubleNumber label="width, height" value={wh} onChange={(numbers) => setWh(numbers)} />
      </Field.Container>
    </div>
  );
};
