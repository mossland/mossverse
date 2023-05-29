"use client";
import { AreaBox } from "../../client";
import { Field, Select } from "@shared/client";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { st, usePage } from "@decentverse/client";
import { useRef } from "react";

interface GeneralProps {
  webviewId?: string | null;
}

// * 데이터 수정/생성 템플릿을 작성하세요. 외부에서 Modal, Div 등으로 컨테이너에 담을 용도로 Fragment(<></>) 기반으로 제작하세요.
export const General = ({ webviewId = undefined }: GeneralProps) => {
  const webviewForm = st.use.webviewForm();
  const { l } = usePage();
  return (
    <>
      <AreaBox color="#6666FF" wh={webviewForm.wh} center={webviewForm.center} />
      <Select
        value={webviewForm.purpose}
        style={{ width: "100%" }}
        onChange={(purpose) => st.do.setPurposeOnWebview(purpose)}
      >
        <Select.Option value="default">default</Select.Option>
        <Select.Option value="youtube">youtube</Select.Option>
        <Select.Option value="image">image</Select.Option>
        <Select.Option value="twitter">twitter</Select.Option>
      </Select>
      <Field.Text label="URL" value={webviewForm.url} onChange={(url) => st.do.setUrlOnWebview(url)} />
      <Field.Text
        label="Message"
        value={webviewForm.message}
        onChange={(message) => st.do.setMessageOnWebview(message)}
      />
      <Field.Text
        label="Error"
        value={webviewForm.errorMessage}
        onChange={(errorMessage) => st.do.setErrorMessageOnWebview(errorMessage)}
      />
      <div className="inline-block">
        <div className="flex gap-2">
          isEmbed{" "}
          <input
            type="checkbox"
            className="toggle"
            checked={webviewForm.isEmbed}
            onChange={(e) => st.do.setIsEmbedOnWebview(e.target.checked)}
          />
        </div>
      </div>
    </>
  );
};

export const Preview = () => {
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
