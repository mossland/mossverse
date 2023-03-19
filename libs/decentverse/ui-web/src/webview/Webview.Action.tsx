import { gql, slice, st, useLocale } from "@decentverse/data-access";
import { Button, Input, Modal } from "antd";
import { isMobile } from "react-device-detect";
import { Vector3 } from "three";
import { CSSProperties, useEffect, useMemo } from "react";
import { Html } from "@react-three/drei";
import { InteractionIcon } from "../common";

interface GuideProps {
  slice?: slice.WebviewSlice;
  webview: gql.LightWebview;
  idx?: number;
}
export const Guide = ({ slice = st.slice.webview, webview, idx }: GuideProps) => {
  useEffect(() => {
    const open = (e: KeyboardEvent) => e.key === " " && st.do.setWebviewModal("open");
    window.addEventListener("keydown", open);
    return () => {
      window.removeEventListener("keydown", open);
    };
  }, []);

  const guideStyle: CSSProperties = useMemo(
    () => ({
      backgroundColor: `#66FEF0`,
      color: "#000",
      width: "max-content",
      borderRadius: 4,
      padding: "14px 24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      wordWrap: "normal",
      fontSize: "1.2em",
      border: "2px dashed #000",
    }),
    []
  );

  return (
    <mesh position={new Vector3(...webview.center, -0.00000005)}>
      {isMobile ? (
        <Html center style={guideStyle}>
          <div style={{ display: "block", marginRight: 10 }}>Press</div>
          <InteractionIcon />
        </Html>
      ) : (
        <Html center style={guideStyle}>
          {/* Press 'F' */}
          Press SPACE
        </Html>
      )}
    </mesh>
  );
};
