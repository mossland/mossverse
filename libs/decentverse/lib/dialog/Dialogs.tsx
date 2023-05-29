console.log();
// import { dialogStore, types } from "@decentverse/client";
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { QuestionNode, SpeakNode } from "./index";

// export const DialogList = () => {
//   const init = dialogStore.use.init();
//   const dialogs = dialogStore.use.dialogs();
//   useEffect(() => {
//     init();
//   }, []);
//   if (!dialogs) return <></>;
//   return (
//     <>
//       <Button
//         type="primary"
//         block
//         onClick={() => dialogStore.setState({ ...types.defaultDialog, modalOpen: true })}
//         className="dialog-button"
//       >
//         Add Dialog
//       </Button>
//       {dialogs.map((dialog) => (
//         <DialogItem dialog={dialog} />
//       ))}
//     </>
//   );
// };
// interface DialogItemProps {
//   dialog: types.Dialog;
// }
// export const DialogItem = ({ dialog }: DialogItemProps) => {
//   return (
//     <Card title="Dialogs" size="small">
//       {dialog.title}
//       <Button onClick={() => dialogStore.setState({ ...dialog, modalOpen: true })}>Edit</Button>
//       <Button onClick={() => dialogStore.setState({ dialog })}>영역지정</Button>
//     </Card>
//   );
// };

// const fitViewOptions: FitViewOptions = {
//   padding: 0.2,
// };

// export const DialogTool = () => {
//   const nodes = useEditor((state) => state.nodes);
//   const edges = useEditor((state) => state.edges);
//   const onNodesChange = useEditor((state) => state.onNodesChange);
//   const onEdgesChange = useEditor((state) => state.onEdgesChange);
//   const onConnect = useEditor((state) => state.onConnect);
//   const createDialog = useEditor((state) => state.createDialog);
//   const toggleDialogToolOpen = useEditor((state) => state.toggleDialogToolOpen);
//   const inputTitle = useEditor((state) => state.inputTitle);
//   const setInputTitle = useEditor((state) => state.setInputTitle);
//   const isDialogModifyMode = useEditor((state) => state.isDialogModifyMode);
//   const updateDialog = useEditor((state) => state.updateDialog);
//   const initCharacter = useEditor((state) => state.initCharacter);

//   useEffect(() => {
//     initCharacter();
//   }, []);

//   const nodeTypes = useMemo(() => ({ questionNode: QuestionNode, speakNode: SpeakNode }), []);

//   return (
//     <DialogToolContainer>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         fitViewOptions={fitViewOptions}
//         nodeTypes={nodeTypes}
//       />
//       <Buttons>
//         <DialogCharacter />
//         <Space>
//           <Input addonBefore="Title" value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
//           {isDialogModifyMode ? (
//             <Button onClick={updateDialog}>Modify</Button>
//           ) : (
//             <Button onClick={createDialog}>Create</Button>
//           )}
//           <Button onClick={toggleDialogToolOpen}>Cancel</Button>
//         </Space>
//       </Buttons>
//     </DialogToolContainer>
//   );
// };

// export const DialogCharacter = () => {
//   const isCharacterModalOpen = useEditor((state) => state.isCharacterModalOpen);
//   const toggleCharacterModalOpen = useEditor((state) => state.toggleCharacterModalOpen);
//   const characters = useEditor((state) => state.characters);
//   const selectedCharacters = useEditor((state) => state.selectedCharacters);
//   const isSelectedCharacter = useEditor((state) => state.isSelectedCharacter);
//   const updateSelectedCharacters = useEditor((state) => state.updateSelectedCharacters);

//   return (
//     <CharacterContainer>
//       <div className="items">
//         {selectedCharacters.map((character, idx) => (
//           <CharacaterImage key={idx} selected={false}>
//             <div className="ImageWrapper">
//               <img src={character.file.url} />
//             </div>
//           </CharacaterImage>
//         ))}
//       </div>
//       <Button type="primary" block onClick={toggleCharacterModalOpen}>
//         Add Character
//       </Button>
//       <Modal
//         title="Add Character"
//         open={isCharacterModalOpen}
//         onOk={toggleCharacterModalOpen}
//         cancelButtonProps={{ hidden: true }}
//         onCancel={toggleCharacterModalOpen}
//       >
//         {characters.map((character, idx) => (
//           <CharacaterImage
//             key={idx}
//             selected={isSelectedCharacter(character.id)}
//             onClick={() => updateSelectedCharacters(character.id)}
//           >
//             <div className="ImageWrapper">
//               <img src={character.file.url} />
//             </div>
//           </CharacaterImage>
//         ))}
//       </Modal>
//     </CharacterContainer>
//   );
// };

// const CharacterContainer = styled.div``;

// const CharacaterImage = styled.button<{ selected: boolean }>`
//   width: 60px;
//   height: 80px;
//   margin: 4px;
//   border-radius: 10px;
//   border-width: 5px;
//   border-color: ${(props) => (props.selected ? "#348fc4" : "transparent")};
//   cursor: pointer;
//   overflow: hidden;
//   .ImageWrapper {
//     width: 170px;
//     margin-bottom: 10px;
//   }
//   img {
//     vertical-align: top;
//     width: 100%;
//     -webkit-user-drag: none;
//   }
// `;

// const DialogToolContainer = styled.div`
//   width: 100%;
//   height: 100vh;
//   z-index: 100;
//   position: absolute;
//   top: 0;
//   left: 0;
//   background: white;
// `;

// const Buttons = styled.div`
//   position: absolute;
//   bottom: 10px;
//   left: 10px;
//   z-index: 10;
// `;
