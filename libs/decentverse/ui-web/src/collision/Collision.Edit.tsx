import { Button, Card, Input } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, OnlyAdmin } from "@shared/ui-web";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { useEffect, useRef } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Utils } from "@shared/util";
import { DeleteOutlined } from "@ant-design/icons";
import { AreaBox, EditPosition } from "../common";

interface CollisionEditProps {
  slice?: slice.CollisionSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const CollisionEdit = ({ slice = st.slice.collision }: CollisionEditProps) => {
  const collisionForm = slice.use.collisionForm();
  const { l } = useLocale();
  return (
    <>
      <AreaBox color="rgba(255, 102, 102, 0.5)" wh={collisionForm.wh} center={collisionForm.center} />
      <EditPosition
        wh={collisionForm.wh}
        center={collisionForm.center}
        setCenter={slice.do.setCenterOnCollision}
        setWh={slice.do.setWhOnCollision}
      />
    </>
  );
};

const CollisionEditPreview = ({ slice = st.slice.collision }: CollisionEditProps) => {
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const center = st.sel((state) => state.collisionForm.center);
  const wh = st.sel((state) => state.collisionForm.wh);
  return (
    <mesh ref={mesh} position={new Vector3(...center, 0.0001)}>
      {wh.length ? <planeGeometry ref={plane} args={wh} /> : null}
      <meshBasicMaterial color="#FF6666" opacity={0.5} transparent />
    </mesh>
  );
};
CollisionEdit.Preview = CollisionEditPreview;
