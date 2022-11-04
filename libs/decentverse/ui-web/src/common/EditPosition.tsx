import { useState } from "react";
import styled from "styled-components";
import { Field } from "@shared/ui-web";
import { Button } from "antd";

interface EditPositionProps {
  center: [number, number];
  wh: [number, number];
  onModify: (center: [number, number], wh: [number, number]) => void;
}

export const EditPosition = ({ center, wh, onModify }: EditPositionProps) => {
  const [centerInput, setCenterInput] = useState<[number, number]>(center);
  const [whInput, setWhInput] = useState<[number, number]>(wh);

  const isChanged =
    center[0] !== centerInput[0] || center[1] !== centerInput[1] || wh[0] !== whInput[0] || wh[1] !== whInput[1];

  return (
    <StyledEditPosition>
      <Field.Container>
        <Field.DoubleNumber label="center (x, y)" value={centerInput} onChange={(numbers) => setCenterInput(numbers)} />
        <Field.DoubleNumber label="width, height" value={whInput} onChange={(numbers) => setWhInput(numbers)} />
        <Button
          onClick={() => onModify(centerInput, whInput)}
          size="small"
          block
          style={{ marginTop: 10 }}
          disabled={!isChanged}
        >
          Edit
        </Button>
      </Field.Container>
    </StyledEditPosition>
  );
};

const StyledEditPosition = styled.div``;
