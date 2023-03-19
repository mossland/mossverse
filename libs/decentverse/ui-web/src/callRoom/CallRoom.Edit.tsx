import { Button, Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";
import { useEffect, useRef } from "react";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Utils } from "@shared/util";

interface CallRoomEditProps {
  callRoomId?: string | null;
  slice?: slice.CallRoomSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const CallRoomEdit = ({ slice = st.slice.callRoom, callRoomId = undefined }: CallRoomEditProps) => {
  const callRoomForm = slice.use.callRoomForm();
  const { l } = useLocale();
  return (
    <>
      <Field.Number
        label="MaxNum"
        value={callRoomForm.maxNum}
        onChange={(numbers) => slice.do.setMaxNumOnCallRoom(numbers)}
      />
      <Field.SwitchItem
        label="videoRoom"
        checked={callRoomForm.roomType === "video"}
        onChange={(checked) => slice.do.setRoomTypeOnCallRoom(checked ? "video" : "call")}
      />
    </>
  );
};

const CallRoomEditPreview = ({ slice = st.slice.callRoom }: CallRoomEditProps) => {
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
CallRoomEdit.Preview = CallRoomEditPreview;
