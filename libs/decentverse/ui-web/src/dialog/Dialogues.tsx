console.log();
// import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
// import { types, mapStore, dialogStore, gameStore, dialog } from "../../stores";
// import { Mesh, PlaneGeometry, Vector3 } from "three";
// import { useTexture, Text, Html } from "@react-three/drei";
// import { useInterval } from "../../hooks";
// import { AreaBox, InteractionIcon } from "..";
// import { isMobile } from "react-device-detect";
// import { Utils } from "@shared/util";
// import { CSSProperties } from "styled-components";
// import { Button, Card, Select, Space, Switch } from "antd";
// import { DeleteOutlined } from "@ant-design/icons";
// import { Field } from "@shared/ui-web";
// import { ThreeEvent, useFrame } from "@react-three/fiber";

// export interface DialoguesProp {
//   interaction?: MutableRefObject<types.InteractionState>;
//   player?: MutableRefObject<types.RenderCharacter>;
//   dialogues?: types.Dialogue[] | null;
// }
// export const Dialogues = ({ interaction, player, dialogues = mapStore.use.dialogues() }: DialoguesProp) => {
//   useEffect(() => {
//     if (!interaction) return;
//     const handler = (e: KeyboardEvent) => {
//       if (e.key !== "f") return;
//       if (interaction.current.dialogue) dialogStore.setState({ dialogueOpen: true });
//     };
//     window.addEventListener("keydown", handler);
//     return () => {
//       window.removeEventListener("keydown", handler);
//     };
//   }, []);
//   useInterval(() => {
//     if (!player || !dialogues || !interaction) return;
//     if (interaction.current.dialogue) {
//       //check go outside
//       if (!interaction.current.dialogue) return;
//       if (Utils.isInside(player.current.position, interaction.current.dialogue)) return;
//       interaction.current.dialogue = null;
//       dialogStore.setState({ dialogueOpen: false, dialog: null });
//     } else {
//       //check go inside
//       for (const dialogue of dialogues) {
//         if (!Utils.isInside(player.current.position, dialogue)) continue;
//         interaction.current.dialogue = dialogue;
//         dialogStore.setState({ dialog: dialogue.dialog });
//         return;
//       }
//     }
//   }, 500);
//   if (!dialogues) return <></>;
//   return (
//     <>
//       {dialogues.map((dialogue, idx) => (
//         <Dialogue key={idx} dialogue={dialogue} />
//       ))}
//       <DialogueGuide />
//     </>
//   );
// };

// export interface DialogueProp {
//   dialogue: types.Dialogue;
// }
// export const Dialogue = React.memo(({ dialogue }: DialogueProp) => {
//   const views = mapStore.use.views();
//   return (
//     <mesh position={new Vector3(...dialogue.center, -0.00000005)}>
//       {views.includes("dialogue") && (
//         <>
//           <planeGeometry args={dialogue.wh} />
//           <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
//         </>
//       )}
//     </mesh>
//   );
// });
// interface DialoguePreviewProps {
//   mouse: MutableRefObject<types.Mouse>;
// }
// export const DialoguePreview = ({ mouse }: DialoguePreviewProps) => {
//   const edit = mapStore.use.edit();
//   const mesh = useRef<Mesh>(null);
//   const plane = useRef<PlaneGeometry>(null);
//   const point = useRef<[number, number] | null>();
//   const dialogues = mapStore.use.dialogues();
//   const dialog = dialogStore.use.dialog();
//   const update = mapStore.use.update();
//   useEffect(() => {
//     const cancel = (e: KeyboardEvent) => {
//       if (e.key !== "Escape") return;
//       point.current = null;
//       plane.current?.copy(new PlaneGeometry(5, 5));
//     };
//     window.addEventListener("keydown", cancel);
//     return () => {
//       window.removeEventListener("keydown", cancel);
//     };
//   }, []);
//   useFrame(() => {
//     if (edit !== "dialogue" || !mesh.current || !plane.current) return;
//     if (!point.current) {
//       mesh.current.position.set(mouse.current.x, mouse.current.y, 1);
//     } else {
//       const { center, wh } = Utils.getBox(mouse.current, point.current);
//       mesh.current.position.set(...center, 0.1);
//       plane.current.copy(new PlaneGeometry(...wh));
//       plane.current.copy(new PlaneGeometry(...wh));
//     }
//   });
//   if (edit !== "dialogue" || !dialogues) return <></>;

//   const handleClick = async (e: ThreeEvent<PointerEvent> | any) => {
//     if (!dialog) return;
//     if (!point.current) point.current = [e.point.x, e.point.y];
//     else {
//       const { center, wh } = Utils.getBox(e.point, point.current);
//       mapStore.setState({
//         dialogues: [...dialogues, { dialog, center, wh, id: "" }],
//       });
//       plane.current?.copy(new PlaneGeometry(5, 5));
//       point.current = null;
//       await update();
//     }
//   };
//   return (
//     <mesh ref={mesh} onClick={handleClick}>
//       <planeGeometry ref={plane} args={[5, 5]} />
//       <meshBasicMaterial color="#6666FF" opacity={0.5} transparent />
//     </mesh>
//   );
// };

// const DialogueGuide = () => {
//   const dialogueOpen = dialogStore.use.dialogueOpen();
//   if (dialogueOpen) return <></>;
//   return isMobile ? (
//     <Html center style={guideStyle}>
//       <div style={{ display: "block", marginRight: 10 }}>Press</div>
//       <InteractionIcon />
//     </Html>
//   ) : (
//     <Html center style={{ ...guideStyle, width: "max-content" }}>
//       Press 'F'
//     </Html>
//   );
// };
// const guideStyle: CSSProperties = {
//   backgroundColor: `rgba(0,0,0,${0.7})`,
//   color: "white",
//   width: "max-content",
//   borderRadius: 10,
//   padding: 10,
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   wordWrap: "normal",
//   fontSize: "1.2em",
// };
// export const DialogueList = () => {
//   const dialogues = mapStore.use.dialogues();
//   const pointer = mapStore.use.pointer();
//   const update = mapStore.use.update();
//   if (!dialogues) return <></>;
//   const targets = dialogues.filter((dialogue) => Utils.isIn(pointer, dialogue));
//   const handleRemove = async (dialogue: types.Dialogue) => {
//     mapStore.setState({ dialogues: dialogues.filter((l) => l !== dialogue) });
//     await update();
//   };
//   return (
//     <>
//       {targets.map((dialogue) => (
//         <DialogueItem key={dialogue.id} dialogue={dialogue} onRemove={() => handleRemove(dialogue)} />
//       ))}
//     </>
//   );
// };
// interface DialogueItemProps {
//   dialogue: types.Dialogue;
//   onRemove: () => void;
// }
// export const DialogueItem = ({ dialogue, onRemove }: DialogueItemProps) => {
//   return (
//     <Card>
//       <AreaBox color="#6666FF" wh={dialogue.wh} center={dialogue.center} />
//       <Button icon={<DeleteOutlined />} onClick={onRemove} size="small">
//         delete
//       </Button>
//     </Card>
//   );
// };
