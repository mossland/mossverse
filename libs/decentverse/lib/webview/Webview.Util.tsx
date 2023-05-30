"use client";
import * as Webview from "./_client";
import { AiOutlineWarning } from "react-icons/ai";
import { CSSProperties, useEffect, useMemo } from "react";
import { DataDashboard } from "@shared/client";
import { DataMenuItem, ModelDashboardProps } from "@util/client";
import { Html } from "@react-three/drei";
import { InteractionIcon } from "../../client";
import { Vector3 } from "three";
import { fetch, st } from "@decentverse/client";
import { isMobile } from "react-device-detect";

export const Menu: DataMenuItem = {
  key: "webview",
  label: "Webview",
  icon: <AiOutlineWarning />, // ! need to be customized
  render: () => <Webview.Zone.Admin />,
};

export const Stat = ({
  className,
  summary,
  sliceName = "webview",
  queryMap = fetch.webviewQueryMap,
  hidePresents,
}: ModelDashboardProps<fetch.WebviewSummary>) => {
  return (
    <DataDashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalWebview"]}
      hidePresents={hidePresents}
    />
  );
};

interface GuideProps {
  webview: fetch.LightWebview;
}
export const Guide = ({ webview }: GuideProps) => {
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
