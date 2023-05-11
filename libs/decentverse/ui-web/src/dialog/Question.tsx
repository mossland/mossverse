console.log();
// import React, { memo } from "react";
// import { Handle, Position } from "react-flow-renderer";
// import { useEditor, types } from "../../stores";
// import { QuestionInputModal } from "./index";
// import { Button, Empty, Popconfirm, Tooltip } from "antd";
// import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// export const QuestionInputModal = ({ id }: { id: string }) => {
//   const isQuestionInputModalOpen = useEditor((state) => state.isQuestionInputModalOpen);
//   const closeQuestionModal = useEditor((state) => state.closeQuestionModal);
//   const inputQuestion = useEditor((state) => state.inputQuestion);
//   const setInputQuestion = useEditor((state) => state.setInputQuestion);
//   const addQuestion = useEditor((state) => state.addQuestion);
//   const questionModalType = useEditor((state) => state.questionModalType);
//   const questionModifyId = useEditor((state) => state.questionModifyId);
//   const modifyQuestion = useEditor((state) => state.modifyQuestion);

//   return (
//     <Modal
//       title={questionModalType === "Add" ? "Add Question" : "Modify Question"}
//       open={isQuestionInputModalOpen}
//       onOk={() => (questionModalType === "Add" ? addQuestion(id) : modifyQuestion(id, questionModifyId))}
//       onCancel={closeQuestionModal}
//       okButtonProps={{ disabled: !inputQuestion }}
//     >
//       <Input
//         addonBefore="Question"
//         style={{ width: "100%" }}
//         value={inputQuestion}
//         onChange={(e) => setInputQuestion(e.target.value)}
//       />
//     </Modal>
//   );
// };

// export const QuestionNode = ({ id, data }: { id: string; data: types.TQuestionData }) => {
//   const deleteFlow = useEditor((state) => state.deleteFlow);
//   const openQuestionAddModal = useEditor((state) => state.openQuestionAddModal);
//   const openQuestionModifyModal = useEditor((state) => state.openQuestionModifyModal);

//   return (
//     <NodeContainer>
//       <Handle type="target" position={Position.Top} id="input" />
//       <div className="header">
//         <h2>Question Flow #{id}</h2>
//         <h3>{data.label}</h3>

//         <Popconfirm
//           className="delete-button"
//           placement="bottomRight"
//           title="Are you sure to delete this flow?"
//           onConfirm={() => deleteFlow(id)}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button size="small" icon={<DeleteOutlined />} shape="circle" />
//         </Popconfirm>
//       </div>
//       <div className="body">
//         <QuestionInputModal id={id} />

//         {!data.questions.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

//         <div className="question-list">
//           {data.questions.map((cur, index) => (
//             <div key={index} className="question-item" onClick={() => openQuestionModifyModal(id, cur.id)}>
//               <Tooltip placement="topLeft" title={cur.text}>
//                 <p>
//                   #{cur.nextNodeId}: {cur.text}
//                 </p>
//               </Tooltip>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="add-button" onClick={openQuestionAddModal}>
//         <div>
//           <PlusOutlined /> Question
//         </div>
//       </div>

//       {data.questions.map((cur, index) => (
//         <Handle
//           key={index}
//           type="source"
//           position={Position.Bottom}
//           id={`output-${cur.id}`}
//           style={{ left: (index + 1) * 10 }}
//         />
//       ))}
//     </NodeContainer>
//   );
// };

// const NodeContainer = styled.div`
//   border: 1px solid #666;
//   width: 200px;
//   border-radius: 10px;
//   font-size: 10px;
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
//   svg {
//     vertical-align: baseline;
//   }
//   .header {
//     height: 40px;
//     padding: 5px;
//     border-bottom: 1px solid #ccc;
//   }
//   .body {
//     padding: 10px;
//     position: relative;
//     .question-list {
//       .question-item {
//         background-color: #eee;
//         margin-bottom: 4px;
//         padding: 2px;
//         border-radius: 4px;
//         p {
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           margin-bottom: 0;
//         }
//       }
//     }
//   }
//   input {
//     border: 1px solid black;
//   }
//   .ant-btn {
//     font-size: 10px;
//   }
//   .delete-button {
//     position: absolute;
//     top: 10px;
//     right: 10px;
//   }
//   .add-button {
//     display: flex;
//     border-top: 1px solid #ccc;
//     /* text-align: center; */
//     padding: 4px;
//     cursor: pointer;
//     transition: 0.3s;
//     border-bottom-left-radius: 10px;
//     border-bottom-right-radius: 10px;
//     align-items: center;
//     justify-content: center;

//     &:hover {
//       background-color: #eee;
//     }
//   }

//   .ant-empty-normal {
//     margin: 8px 0;
//   }
//   .ant-empty-description {
//     font-size: 10px;
//   }
// `;
