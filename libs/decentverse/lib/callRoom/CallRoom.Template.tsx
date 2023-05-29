"use client";
import { Field } from "@shared/client";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { st, usePage } from "@decentverse/client";
import { useRef } from "react";

interface CallRoomEditProps {
  callRoomId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ callRoomId = undefined }: CallRoomEditProps) => {
  const callRoomForm = st.use.callRoomForm();
  const { l } = usePage();
  return (
    <>
      <Field.Number
        label="MaxNum"
        value={callRoomForm.maxNum}
        onChange={(numbers) => st.do.setMaxNumOnCallRoom(numbers)}
      />
      <Field.SwitchItem
        label="videoRoom"
        checked={callRoomForm.roomType === "video"}
        onChange={(checked) => st.do.setRoomTypeOnCallRoom(checked ? "video" : "call")}
      />
    </>
  );
};

export const Preview = () => {
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const center = st.sel((state) => state.callRoomForm.center);
  const wh = st.sel((state) => state.callRoomForm.wh);
  return (
    <mesh ref={mesh} position={new Vector3(...center, 0.0001)}>
      {wh.length && <planeGeometry ref={plane} args={wh} />}
      <meshBasicMaterial color="#36B3A0" opacity={0.5} transparent />
    </mesh>
  );
};
