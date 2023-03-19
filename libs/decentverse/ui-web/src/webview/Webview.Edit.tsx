import { Select, Switch } from "antd";
import { gql, st, slice, useLocale } from "@decentverse/data-access";
import { Editor, Field, OnlyAdmin } from "@shared/ui-web";
import { AreaBox } from "../common";
import { useEffect, useRef } from "react";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { Utils } from "@shared/util";
import { ThreeEvent, useFrame } from "@react-three/fiber";

interface WebviewEditProps {
  webviewId?: string | null;
  slice?: slice.WebviewSlice;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const WebviewEdit = ({ slice = st.slice.webview, webviewId = undefined }: WebviewEditProps) => {
  const webviewForm = slice.use.webviewForm();
  const { l } = useLocale();
  return (
    <>
      <AreaBox color="#6666FF" wh={webviewForm.wh} center={webviewForm.center} />
      <Select
        value={webviewForm.purpose}
        style={{ width: "100%" }}
        onChange={(purpose) => slice.do.setPurposeOnWebview(purpose)}
      >
        <Select.Option value="default">default</Select.Option>
        <Select.Option value="youtube">youtube</Select.Option>
        <Select.Option value="image">image</Select.Option>
        <Select.Option value="twitter">twitter</Select.Option>
      </Select>
      <Field.Text label="URL" value={webviewForm.url} onChange={(url) => slice.do.setUrlOnWebview(url)} />
      <Field.Text
        label="Message"
        value={webviewForm.message}
        onChange={(message) => slice.do.setMessageOnWebview(message)}
      />
      <Field.Text
        label="Error"
        value={webviewForm.errorMessage}
        onChange={(errorMessage) => slice.do.setErrorMessageOnWebview(errorMessage)}
      />
      <div className="inline-block">
        <div className="flex gap-2">
          isEmbed <Switch checked={webviewForm.isEmbed} onChange={(isEmbed) => slice.do.setIsEmbedOnWebview(isEmbed)} />
        </div>
      </div>
    </>
  );
};

const WebviewEditPreview = ({ slice = st.slice.webview }: WebviewEditProps) => {
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const center = st.sel((state) => state.webviewForm.center);
  const wh = st.sel((state) => state.webviewForm.wh);
  return (
    <mesh ref={mesh} position={new Vector3(...center, 0.0001)}>
      {wh.length && <planeGeometry ref={plane} args={wh} />}
      <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
    </mesh>
  );
};
WebviewEdit.Preview = WebviewEditPreview;
