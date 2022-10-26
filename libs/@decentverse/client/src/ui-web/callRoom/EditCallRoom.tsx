import { useState } from "react";
import styled from "styled-components";
import { Field } from "@shared/ui-web";
import { Button } from "antd";
import { cnst } from "@shared/util";

interface EditPositionProps {
  maxNum: number;
  roomType: cnst.RoomType;
  onModify: (maxNum: number, roomType: cnst.RoomType) => void;
}

export const EditCallRoom = ({ maxNum, roomType, onModify }: EditPositionProps) => {
  const [maxNumInput, setMaxNumInput] = useState(maxNum);
  const [roomTypeInput, setRoomTypeInput] = useState(roomType);

  const isChanged = maxNum !== maxNumInput || roomType !== roomTypeInput;

  return (
    <StyledEditPosition>
      <Field.Container>
        <Field.Number label="MaxNum" value={maxNumInput} onChange={(numbers) => setMaxNumInput(numbers)} />
        <Field.SwitchItem
          label="videoRoom"
          checked={roomTypeInput === "video"}
          onChange={(value) => setRoomTypeInput(value ? "video" : "call")}
        />

        <Button
          onClick={() => onModify(maxNumInput, roomTypeInput)}
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
