import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { types, mapStore, webviewStore, gameStore } from "../../stores";
import { Mesh, PlaneGeometry, Vector3 } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { AreaBox, InteractionIcon } from "..";
import { isMobile } from "react-device-detect";
import { Utils } from "@shared/util";
import { CSSProperties } from "styled-components";
import { Button, Card, Select, Space, Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Field } from "@shared/ui-web";
import { ThreeEvent, useFrame } from "@react-three/fiber";

export interface WebviewsProp {
  interaction?: MutableRefObject<types.InteractionState>;
  player?: MutableRefObject<types.RenderCharacter>;
  webviews?: types.Webview[] | null;
}
export const Webviews = ({ interaction, player, webviews = mapStore.use.webviews() }: WebviewsProp) => {
  useEffect(() => {
    if (!interaction) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "f" && e.code !== "Space") return;
      if (interaction.current.webview) webviewStore.setState({ webviewOpen: true });
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
  useInterval(() => {
    if (!player || !webviews || !interaction) return;
    if (interaction.current.webview) {
      //check go outside
      if (!interaction.current.webview) return;
      if (Utils.isInside(player.current.position, interaction.current.webview)) return;
      interaction.current.webview = null;
      webviewStore.setState({ webviewOpen: false, webview: null, operation: "loading" });
    } else {
      //check go inside
      for (const webview of webviews) {
        if (!Utils.isInside(player.current.position, webview)) continue;
        interaction.current.webview = webview;
        webviewStore.setState({ webview });
        return;
      }
    }
  }, 500);
  if (!webviews) return <></>;
  return (
    <>
      {webviews.map((webview, idx) => (
        <Webview key={idx} webview={webview} />
      ))}
      <WebviewGuide />
    </>
  );
};

export interface WebviewProp {
  webview: types.Webview;
}
export const Webview = React.memo(({ webview }: WebviewProp) => {
  const views = mapStore.use.views();
  return (
    <mesh position={new Vector3(...webview.center, -0.00000005)}>
      {views.includes("webview") && (
        <>
          <planeGeometry args={webview.wh} />
          <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
        </>
      )}
    </mesh>
  );
});
interface WebviewPreviewProps {
  mouse: MutableRefObject<types.Mouse>;
}
export const WebviewPreview = ({ mouse }: WebviewPreviewProps) => {
  const edit = mapStore.use.edit();
  const mesh = useRef<Mesh>(null);
  const plane = useRef<PlaneGeometry>(null);
  const point = useRef<[number, number] | null>();
  const webviews = mapStore.use.webviews();
  const update = mapStore.use.update();
  const get = webviewStore.use.get();
  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      point.current = null;
      plane.current?.copy(new PlaneGeometry(5, 5));
    };
    window.addEventListener("keydown", cancel);
    return () => {
      window.removeEventListener("keydown", cancel);
    };
  }, []);
  useFrame(() => {
    if (edit !== "webview" || !mesh.current || !plane.current) return;
    if (!point.current) {
      mesh.current.position.set(mouse.current.x, mouse.current.y, 1);
    } else {
      const { center, wh } = Utils.getBox(mouse.current, point.current);
      mesh.current.position.set(...center, 0.1);
      plane.current.copy(new PlaneGeometry(...wh));
      plane.current.copy(new PlaneGeometry(...wh));
    }
  });
  if (edit !== "webview" || !webviews) return <></>;

  const handleClick = async (e: ThreeEvent<PointerEvent> | any) => {
    if (!point.current) point.current = [e.point.x, e.point.y];
    else {
      const { center, wh } = Utils.getBox(e.point, point.current);
      mapStore.setState({
        webviews: [...webviews, { ...get(), center, wh, id: "" }],
      });
      plane.current?.copy(new PlaneGeometry(5, 5));
      point.current = null;
      await update();
    }
  };
  return (
    <mesh ref={mesh} onClick={handleClick}>
      <planeGeometry ref={plane} args={[5, 5]} />
      <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
    </mesh>
  );
};

const WebviewGuide = () => {
  const webviewOpen = webviewStore.use.webviewOpen();
  const webview = webviewStore.use.webview();
  if (webviewOpen || !webview) return <></>;

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
const guideStyle: CSSProperties = {
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
};
export const WebviewList = () => {
  const webviews = mapStore.use.webviews();
  const pointer = mapStore.use.pointer();
  const update = mapStore.use.update();
  if (!webviews) return <></>;
  const targets = webviews.filter((webview) => Utils.isIn(pointer, webview));
  const handleRemove = async (webview: types.Webview) => {
    mapStore.setState({ webviews: webviews.filter((l) => l !== webview) });
    await update();
  };
  return (
    <>
      {targets.map((webview) => (
        <WebviewItem key={webview.id} webview={webview} onRemove={() => handleRemove(webview)} />
      ))}
    </>
  );
};
interface WebviewItemProps {
  webview: types.Webview;
  onRemove: () => void;
}
export const WebviewItem = ({ webview, onRemove }: WebviewItemProps) => {
  return (
    <Card
      title="Webview"
      size="small"
      extra={
        <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
          delete
        </Button>
      }
    >
      <AreaBox color="#6666FF" wh={webview.wh} center={webview.center} />
    </Card>
  );
};

export const WebViewEdit = () => {
  const url = webviewStore.use.url();
  const purpose = webviewStore.use.purpose();
  const message = webviewStore.use.message();
  const errorMessage = webviewStore.use.errorMessage();
  const isEmbed = webviewStore.use.isEmbed();
  return (
    <Space direction="vertical">
      {/* <Input.Group compact style={{ width: "100%", marginBottom: 20 }}> */}
      <Select value={purpose} style={{ width: "100%" }} onChange={(purpose) => webviewStore.setState({ purpose })}>
        <Select.Option value="default">default</Select.Option>
        <Select.Option value="youtube">youtube</Select.Option>
        <Select.Option value="image">image</Select.Option>
        <Select.Option value="twitter">twitter</Select.Option>
      </Select>
      <Field.Container>
        <Field.Text label="URL" value={url} onChange={(url) => webviewStore.setState({ url })} />
        <Field.Text label="Message" value={message} onChange={(message) => webviewStore.setState({ message })} />
        <Field.Text
          label="Error"
          value={errorMessage}
          onChange={(errorMessage) => webviewStore.setState({ errorMessage })}
        />
        <Space>
          isEmbed <Switch checked={isEmbed ?? true} onChange={(isEmbed) => webviewStore.setState({ isEmbed })} />
        </Space>
      </Field.Container>
    </Space>
  );
};
