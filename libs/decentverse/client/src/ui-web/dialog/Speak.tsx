console.log();
// import { useEffect, useRef, useState } from "react";
// import styled from "styled-components";
// import { Modal, Button, Space, Input, Radio, Col, Row, Select } from "antd";
// import { CloseOutlined, ToolOutlined } from "@ant-design/icons";
// import { dialogStore, useEditor } from "../../stores";

// export const SpeakInputModal = ({ id, isAdd }: { id: string; isAdd: boolean }) => {
//   const nodes = useEditor((state) => state.nodes);
//   const speakModalOpen = dialogStore.use.speakModalOpen();

//   const inputAvatarPosition = useEditor((state) => state.inputAvatarPosition);
//   const setInputAvatarPosition = useEditor((state) => state.setInputAvatarPosition);
//   const inputFlowText = useEditor((state) => state.inputFlowText);
//   const inputFlowTextArray = useEditor((state) => state.inputFlowTextArray);
//   const inputModifyFlowText = useEditor((state) => state.inputModifyFlowText);
//   const setInputFlowText = useEditor((state) => state.setInputFlowText);
//   const setInputModifyFlowText = useEditor((state) => state.setInputModifyFlowText);
//   const addFlowText = useEditor((state) => state.addFlowText);
//   const removeFlowText = useEditor((state) => state.removeFlowText);
//   const editFlowText = useEditor((state) => state.editFlowText);
//   const isEditFlowText = useEditor((state) => state.isEditFlowText);
//   const setIsEditFlowText = useEditor((state) => state.setIsEditFlowText);
//   const modifyFlowTextIndex = useEditor((state) => state.modifyFlowTextIndex);
//   const speakModalNodeId = useEditor((state) => state.speakModalNodeId);
//   const addFlow = useEditor((state) => state.addFlow);
//   const selectedCharacters = useEditor((state) => state.selectedCharacters);
//   const inputCharacterId = useEditor((state) => state.inputCharacterId);
//   const setInputCharacterId = useEditor((state) => state.setInputCharacterId);

//   return (
//     <>
//       <Button type="primary" block onClick={() => openSpeakInputModalOpen(id)}>
//         {isAdd ? `Add Speak` : `Modify Speak`}
//       </Button>
//       <Modal
//         title="Add Speak"
//         open={isSpeakInputModalOpen}
//         // onOk={() => addQuestion(id)}
//         onOk={addFlow}
//         onCancel={() => closeSpeakInputModalOpen()}
//         // okButtonProps={{ disabled: !inputQuestion }}
//         width={1000}
//       >
//         <Row gutter={10}>
//           <Col span={8}>
//             <div>
//               <EmptyCharacater selected={inputCharacterId === ""} onClick={() => setInputCharacterId("")}>
//                 Empty
//               </EmptyCharacater>
//               {selectedCharacters.map((character, idx) => (
//                 <CharacaterImage
//                   key={idx}
//                   selected={inputCharacterId === character.id}
//                   onClick={() => setInputCharacterId(character.id)}
//                 >
//                   <div className="ImageWrapper">
//                     <img src={character.file.url} />
//                   </div>
//                 </CharacaterImage>
//               ))}
//             </div>

//             {/* <Space> */}
//             {/* <Select style={{ width: 120 }} value={selectedCharacterIndex} onChange={setSelectedCharacterIndex}>
//                       {characters.map((cur, index) => (
//                         <Select.Option key={index} value={index}>
//                           {cur.name}
//                         </Select.Option>
//                       ))}
//                     </Select> */}

//             <Select style={{ width: 120 }} value={inputAvatarPosition} onChange={setInputAvatarPosition}>
//               <Select.Option value="left">left</Select.Option>
//               <Select.Option value="right">right</Select.Option>
//               <Select.Option value="center">center</Select.Option>
//             </Select>
//             {/* </Space> */}
//           </Col>
//           <Col span={16}>
//             <TextContainer>
//               <div className="text-list">
//                 {/* {nodes
//                   ?.find((cur) => cur.id === speakModalNodeId)
//                   ?.data?.text?.map((cur: string, index: number) => ( */}
//                 {inputFlowTextArray.map((cur: string, index: number) => (
//                   <div key={index}>
//                     <div className="text-item">
//                       {isEditFlowText && modifyFlowTextIndex === index ? (
//                         <Space direction="vertical" style={{ width: "100%" }}>
//                           <Input.TextArea
//                             value={inputModifyFlowText}
//                             onChange={(e) => setInputModifyFlowText(e.target.value)}
//                             autoSize={{ minRows: 3, maxRows: 5 }}
//                             showCount
//                             maxLength={100}
//                           />

//                           <Row gutter={10}>
//                             <Col span={4}>
//                               <Button onClick={removeFlowText} block type="link">
//                                 Delete
//                               </Button>
//                             </Col>
//                             <Col span={20}>
//                               <Button onClick={editFlowText} block>
//                                 Modify
//                               </Button>
//                             </Col>
//                           </Row>

//                           <Button
//                             onClick={() => setIsEditFlowText(false, index)}
//                             className="text-side-button"
//                             type="link"
//                             icon={<CloseOutlined />}
//                           />
//                         </Space>
//                       ) : (
//                         <>
//                           {cur}
//                           <Button
//                             onClick={() => setIsEditFlowText(true, index)}
//                             className="text-side-button"
//                             type="link"
//                             icon={<ToolOutlined />}
//                           />
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ paddingTop: 10 }}>
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Input.TextArea
//                     value={inputFlowText}
//                     onChange={(e) => setInputFlowText(e.target.value)}
//                     autoSize={{ minRows: 3, maxRows: 5 }}
//                     showCount
//                     maxLength={100}
//                   />
//                   <Button type="primary" onClick={addFlowText} block>
//                     Add
//                   </Button>
//                 </Space>
//               </div>
//             </TextContainer>
//           </Col>
//         </Row>
//       </Modal>
//     </>
//   );
// };

// export const SpeakNode = ({ id, data }: { id: string; data: types.TSpeakData }) => {
//   const deleteFlow = useEditor((state) => state.deleteFlow);
//   const addSpeakFlow = useEditor((state) => state.addSpeakFlow);
//   const addQuestionFlow = useEditor((state) => state.addQuestionFlow);
//   const selectedCharacters = useEditor((state) => state.selectedCharacters);

//   return (
//     <NodeContainer>
//       <Handle type="target" position={Position.Top} id="input" />
//       <div className="header">
//         <h2>Speak Flow #{id}</h2>
//         <h3>{data.label}</h3>
//         {id !== "1" && (
//           <Popconfirm
//             className="delete-button"
//             placement="bottomRight"
//             title="Are you sure to delete this flow?"
//             onConfirm={() => deleteFlow(id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button size="small" icon={<DeleteOutlined />} shape="circle" />
//           </Popconfirm>
//         )}
//       </div>
//       <div className="body">
//         {!!data.text.length && (
//           <div>
//             <div className="text-item">
//               {data.text[0]}
//               <span className="text-count">{data.text.length}</span>
//             </div>
//             {/* <div> {data.characterId}</div> */}
//             {selectedCharacters.find((cur) => cur.id === data.characterId)?.file?.url && (
//               <CharacaterImage selected={false}>
//                 <div className="ImageWrapper">
//                   <img src={selectedCharacters.find((cur) => cur.id === data.characterId)?.file?.url} />
//                 </div>
//               </CharacaterImage>
//             )}

//             <div> {data.avatarPosition}</div>
//           </div>
//         )}
//         <SpeakInputModal id={id} isAdd={!data.text.length} />
//       </div>
//       <div className="add-buttons">
//         <div
//           className={`add-button ${!data.isAddableFlow && "disabled"}`}
//           onClick={() => data.isAddableFlow && addSpeakFlow(id)}
//         >
//           <PlusOutlined /> Speak Flow
//         </div>
//         <div
//           className={`add-button ${!data.isAddableFlow && "disabled"}`}
//           onClick={() => data.isAddableFlow && addQuestionFlow(id)}
//         >
//           <PlusOutlined /> Question Flow
//         </div>
//       </div>
//       {/* disabled={!data.isAddableFlow} */}
//       {/* <Button onClick={() => addSpeakFlow(id)}>Add Speak Flow</Button> */}
//       {/* <Button onClick={() => addQuestionFlow(id)}>Add Question Flow</Button> */}

//       <Handle type="source" position={Position.Bottom} id="output" />
//     </NodeContainer>
//   );
// };

// const NodeContainer = styled.div`
//   border: 1px solid #666;
//   font-size: 10px;
//   width: 200px;
//   border-radius: 10px;
//   background-color: #fff;
//   h2 {
//     margin-bottom: 0;
//   }
//   h3 {
//     margin-bottom: 0;
//     font-size: 8px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     padding-right: 26px;
//   }
//   .header {
//     height: 40px;
//     padding: 5px;
//     border-bottom: 1px solid #ccc;
//   }
//   .body {
//     padding: 10px;
//     position: relative;
//     .text-item {
//       background-color: #eee;
//       padding: 3px 4px;
//       border-radius: 2px;
//     }
//     .text-count {
//       background-color: #666;
//       color: #fff;
//       padding: 1px 3px;
//       border-radius: 4px;
//       float: right;
//     }
//   }
//   svg {
//     vertical-align: baseline;
//   }
//   .ant-btn {
//     font-size: 10px;
//   }
//   .delete-button {
//     position: absolute;
//     top: 10px;
//     right: 10px;
//   }
//   .add-buttons {
//     display: flex;
//     border-top: 1px solid #ccc;

//     overflow: hidden;
//     .add-button {
//       &:first-child {
//         border-right: 1px solid #ccc;
//         border-bottom-left-radius: 10px;
//       }
//       &:last-child {
//         border-bottom-right-radius: 10px;
//       }
//       &.disabled {
//         background-color: #eee;
//         color: #999;
//       }
//       &:not(.disabled):hover {
//         background-color: #eee;
//       }
//       flex: 1;
//       text-align: center;
//       padding: 4px;
//       cursor: pointer;
//       transition: 0.3s;
//     }
//   }
// `;

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
//     /* height: 240px; */
//     margin-bottom: 10px;
//     /* overflow: hidden; */
//   }
//   img {
//     vertical-align: top;
//     width: 100%;
//     -webkit-user-drag: none;
//   }
// `;

// const TextContainer = styled.div`
//   background-color: #eee;
//   padding: 10px;
//   border-radius: 10px;
//   .text-list {
//     height: 300px;
//     overflow-y: scroll;
//     .text-item {
//       background-color: #ddd;
//       margin-bottom: 10px;
//       padding: 10px;
//       padding-right: 30px;
//       border-radius: 10px;
//       position: relative;
//       .text-side-button {
//         cursor: pointer;
//         position: absolute;
//         top: 0;
//         right: 0;
//       }
//     }
//   }
// `;
// const EmptyCharacater = styled.button<{ selected: boolean }>`
//   width: 60px;
//   height: 80px;
//   margin: 4px;
//   border-radius: 10px;
//   border-width: 5px;
//   border-color: ${(props) => (props.selected ? "#348fc4" : "transparent")};
//   cursor: pointer;
//   overflow: hidden;
//   display: block;
//   font-size: 10px;
// `;

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
//     /* height: 240px; */
//     margin-bottom: 10px;
//     /* overflow: hidden; */
//   }
//   img {
//     vertical-align: top;
//     width: 100%;
//     -webkit-user-drag: none;
//   }
// `;
