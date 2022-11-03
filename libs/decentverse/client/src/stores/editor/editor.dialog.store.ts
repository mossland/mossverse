// // import create from "zustand";
// import { GetState, SetState } from "zustand";
// import * as types from "../types";
// import * as gql from "../gql";
// import { initialEdges, initialNodes } from "./editor.init";
// import {
//   Connection,
//   Edge,
//   EdgeChange,
//   Node,
//   NodeChange,
//   addEdge,
//   OnNodesChange,
//   OnEdgesChange,
//   OnConnect,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from "react-flow-renderer";

// export interface EditorDialogState {
//   dialogs: types.Dialog[];
//   dialogId: string;
//   isQuestionInputModalOpen: boolean;
//   isSpeakInputModalOpen: boolean;
//   isDialogToolOpen: boolean; //
//   isDialogModifyMode: boolean;
//   inputQuestion: string;
//   inputTitle: string;
//   inputFlowText: string;
//   inputFlowTextArray: string[];
//   inputModifyFlowText: string;
//   modifyFlowTextIndex: number;
//   speakModalNodeId: string;
//   inputAvatarPosition: types.TAvatarPosition;
//   inputCharacterId: string;
//   flows: types.TFlow[];
//   nodes: Node[];
//   edges: Edge[];
//   onNodesChange: OnNodesChange;
//   onEdgesChange: OnEdgesChange;
//   onConnect: OnConnect;
//   questionModalType: "Add" | "Modify";
//   questionModifyId: string;
//   isEditFlowText: boolean;
//   selectedCharacters: types.Character[];
//   initDialogList: () => Promise<void>;
//   openDialogEdit: (dialogId: string) => Promise<void>;
//   toggleDialogToolOpen: () => void; //
//   // toggleQuestionInputModalOpen: () => void;
//   openQuestionAddModal: () => void;
//   closeQuestionModal: () => void;
//   openQuestionModifyModal: (nodeId: string, questionId: string) => void;
//   // toggleSpeakInputModalOpen: (nodeId: string) => void;
//   openSpeakInputModalOpen: (nodeId: string) => void;
//   closeSpeakInputModalOpen: () => void;
//   addFlow: () => void;
//   addDialog: () => Promise<void>;
//   setInputTitle: (title: string) => void;
//   setInputQuestion: (text: string) => void;
//   setInputFlowText: (text: string) => void;
//   setInputModifyFlowText: (text: string) => void;
//   setInputAvatarPosition: (position: types.TAvatarPosition) => void;
//   addQuestion: (id: string) => void;
//   modifyQuestion: (nodeId: string, questionId: string) => void;
//   addSpeakFlow: (prevId: string, label?: string, handleId?: string) => string;
//   addQuestionFlow: (prevId: string) => string;
//   deleteFlow: (nodeId: string) => void;
//   addFlowText: () => void;
//   removeFlowText: () => void;
//   editFlowText: () => void;
//   setIsEditFlowText: (isOpen: boolean, index: number) => void;
//   makeDialogData: () => types.DialogInput;
//   createDialog: () => Promise<void>;
//   updateDialog: () => Promise<void>;
//   removeDialog: () => Promise<void>;
//   updateSelectedCharacters: (characterId: string) => void;
//   isSelectedCharacter: (characterId: string) => boolean;
//   setInputCharacterId: (characterId: string) => void;
//   // checkAddableFlow: (id: string, handleId?: string) => boolean;
// }

// export const editorDialogSlice: EditorSlice<EditorDialogState> = (set, get) => ({
//   dialogs: [],
//   dialogId: "",
//   isQuestionInputModalOpen: false,
//   isSpeakInputModalOpen: false,
//   isDialogToolOpen: false, //
//   isDialogModifyMode: false,
//   inputQuestion: "",
//   inputTitle: "",
//   inputFlowText: "",
//   inputFlowTextArray: [],
//   inputModifyFlowText: "",
//   modifyFlowTextIndex: 0,
//   inputAvatarPosition: "left",
//   inputCharacterId: "",
//   selectedCharacterIndex: 0,
//   flows: [],
//   nodes: initialNodes,
//   edges: initialEdges,
//   questionModalType: "Add",
//   questionModifyId: "",
//   speakModalNodeId: "",
//   isEditFlowText: false,
//   selectedCharacters: [],
//   initDialogList: async () => {
//     const dialogs = await gql.dialogs();
//     set({ dialogs });
//   },
//   openDialogEdit: async (dialogId) => {
//     if (!get().characters.length) await get().initCharacter();
//     const dialog = get().dialogs.find((cur) => cur.id === dialogId);

//     const nodes: any[] = [];
//     const edges: any[] = [];
//     // const selectedCharactersId: string[] = [];
//     let selectedCharacters: types.Character[] = [];

//     dialog?.flows.forEach((cur) => {
//       const type = cur.style === "speak" ? "speakNode" : "questionNode";
//       let data;

//       if (cur.style === "speak") {
//         if (cur.character && !selectedCharacters.find((character) => character.id === cur.character)) {
//           const newCharacter = get().characters.find((character) => character.id === cur.character);
//           if (newCharacter) selectedCharacters = [...selectedCharacters, newCharacter];
//         }
//         data = {
//           label: "", //!
//           text: cur.texts,
//           avatarPosition: cur.avatarPosition.charAt(0).toUpperCase() + cur.avatarPosition.slice(1),
//           isAddableFlow: !cur.next?.length,
//           characterId: cur.character,
//         };
//       } else {
//         data = {
//           label: "",
//           questions: cur.texts.map((text, index) => ({
//             id: String(index + 1),
//             text: text,
//             nextNodeId: cur.next?.[index],
//           })),
//           isAddableFlow: false,
//         };
//       }

//       const node = {
//         id: cur.subject,
//         type,
//         position: { x: cur.position[0], y: cur.position[1] },
//         data,
//       };

//       cur.next?.forEach((target, index) => {
//         if (cur.style === "speak") {
//           edges.push({ id: `e${cur.subject}-${target}`, source: cur.subject, target });
//         } else {
//           edges.push({
//             id: `e${cur.subject}-${target}`,
//             source: cur.subject,
//             target,
//             sourceHandle: `output-${index + 1}`,
//           });
//         }
//       });

//       nodes.push(node);
//     });

//     set((state) => ({
//       isDialogToolOpen: true,
//       isDialogModifyMode: true,
//       nodes,
//       edges,
//       inputTitle: dialog?.title,
//       dialogId,
//       selectedCharacters,
//     }));
//   },
//   toggleDialogToolOpen: () => {
//     set((state) => ({ isDialogToolOpen: !state.isDialogToolOpen, isDialogModifyMode: false }));
//   },
//   // toggleQuestionInputModalOpen: () => {
//   //   set((state) => ({ isQuestionInputModalOpen: !state.isQuestionInputModalOpen }));
//   // },
//   openQuestionAddModal: () => {
//     set((state) => ({ isQuestionInputModalOpen: true, questionModalType: "Add" }));
//   },
//   closeQuestionModal: () => {
//     set((state) => ({ isQuestionInputModalOpen: false }));
//   },
//   openQuestionModifyModal: (nodeId, questionId) => {
//     const inputQuestion = get()
//       .nodes.find((cur) => cur.id === nodeId)
//       ?.data.questions.find((cur: types.TQuestion) => cur.id === questionId)?.text;
//     set((state) => ({
//       isQuestionInputModalOpen: true,
//       questionModalType: "Modify",
//       questionModifyId: questionId,
//       inputQuestion,
//     }));
//   },
//   // toggleSpeakInputModalOpen: (nodeId) => {
//   //   set((state) => ({ isSpeakInputModalOpen: !state.isSpeakInputModalOpen, speakModalNodeId: nodeId }));
//   // },
//   openSpeakInputModalOpen: (nodeId) => {
//     const currentNode = get().nodes.find((node) => node.id === nodeId);
//     set((state) => ({
//       isSpeakInputModalOpen: true,
//       speakModalNodeId: nodeId,
//       inputFlowTextArray: currentNode?.data.text,
//       inputAvatarPosition: currentNode?.data.avatarPosition,
//       inputCharacterId: currentNode?.data.characterId,
//     }));
//   },
//   closeSpeakInputModalOpen: () => {
//     set((state) => ({ isSpeakInputModalOpen: false }));
//   },
//   addFlow: () => {
//     set((state) => ({
//       nodes: state.nodes.map((cur) => {
//         if (cur.id !== state.speakModalNodeId) return cur;
//         return {
//           ...cur,
//           data: {
//             ...cur.data,
//             text: state.inputFlowTextArray,
//             avatarPosition: state.inputAvatarPosition,
//             characterId: state.inputCharacterId,
//           },
//         };
//       }),
//       inputFlowText: "",
//       inputFlowTextArray: [],
//       isSpeakInputModalOpen: false,
//     }));
//   },
//   addDialog: async () => {
//     const title = get().inputTitle;
//     const characters = ["627ab7b50438d4ceae0f2f56"];
//     // const flows: types.Flow[] = get().flows.map((cur, index) => ({
//     //   avatarPosition: cur.avatarPositions,
//     //   name: get().characters[cur.characterIndex].name,
//     //   position: [0, 0],
//     //   style: "speak" as types.FlowStyle,
//     //   subject: "",
//     //   texts: cur.text,
//     // }));

//     // const dialogInput = { title, characters, flows };
//     // await gql.createDialog(dialogInput);
//   },
//   setInputTitle: (title) => {
//     set({ inputTitle: title });
//   },
//   setInputQuestion: (text) => {
//     set({ inputQuestion: text });
//   },
//   setInputFlowText: (text) => {
//     set({ inputFlowText: text });
//   },
//   setInputModifyFlowText: (text) => {
//     set({ inputModifyFlowText: text });
//   },
//   setInputAvatarPosition: (position) => {
//     set({ inputAvatarPosition: position });
//   },
//   onNodesChange: (changes: NodeChange[]) => {
//     set({
//       nodes: applyNodeChanges(changes, get().nodes),
//     });
//   },
//   onEdgesChange: (changes: EdgeChange[]) => {
//     set({
//       edges: applyEdgeChanges(changes, get().edges),
//     });
//   },
//   onConnect: (connection: Connection) => {
//     set({
//       edges: addEdge(connection, get().edges),
//     });
//   },
//   addQuestion: (id) => {
//     const currentNode = get().nodes.find((cur) => cur.id === id);
//     const questionLength = currentNode?.data?.questions.length;
//     const pervQuestionId = currentNode?.data?.questions?.[questionLength - 1]?.id || 0;
//     const newNodeId = get().addSpeakFlow(id, get().inputQuestion, `output-${Number(pervQuestionId) + 1}`);
//     set({
//       nodes: get().nodes.map((cur) => {
//         if (cur.id !== id) return cur;
//         return {
//           ...cur,
//           data: {
//             ...cur.data,
//             questions: [
//               ...cur.data.questions,
//               { id: String(Number(pervQuestionId) + 1), text: get().inputQuestion, nextNodeId: newNodeId },
//             ],
//           },
//         };
//       }),
//     });
//     set({ inputQuestion: "" });
//     // get().toggleQuestionInputModalOpen();
//     get().closeQuestionModal();
//   },
//   modifyQuestion: (nodeId, questionId) => {
//     const nextNodeId = get()
//       .nodes.find((node) => node.id === nodeId)
//       ?.data.questions.find((question: types.TQuestion) => question.id === questionId).nextNodeId;

//     set((state) => ({
//       nodes: [
//         ...state.nodes.map((node) => {
//           if (node.id === nodeId) {
//             return {
//               ...node,
//               data: {
//                 ...node.data,
//                 questions: [
//                   ...node.data.questions.map((question: types.TQuestion) => {
//                     if (question.id !== questionId) return question;
//                     return { ...question, text: state.inputQuestion };
//                   }),
//                 ],
//               },
//             };
//           }
//           if (node.id === nextNodeId) {
//             return {
//               ...node,
//               data: {
//                 ...node.data,
//                 label: state.inputQuestion,
//               },
//             };
//           }
//           return node;
//         }),
//       ],
//     }));

//     get().closeQuestionModal();
//   },
//   addSpeakFlow: (prevId, label, handleId) => {
//     const newNodeId = String(Number(get().nodes[get().nodes.length - 1].id) + 1);
//     const prevNode = get().nodes.find((cur) => cur.id === prevId);
//     if (!prevNode) return "";
//     const chlidCount = get().edges.filter((cur) => cur.source === prevId).length;
//     const newPositionX = handleId ? prevNode.position.x - 200 + 250 * chlidCount : prevNode.position.x;
//     const newPositionY = prevNode.height ? prevNode.position.y + prevNode.height + 50 : prevNode.position.y + 250;
//     const newNode = {
//       id: newNodeId,
//       type: "speakNode",
//       data: { label: label || "", isAddableFlow: true, text: [] },
//       position: { x: newPositionX, y: newPositionY },
//     };
//     const newEdge = {
//       id: `e${Number(prevNode.id)}-${newNodeId}`,
//       source: prevNode.id,
//       target: newNodeId,
//       sourceHandle: handleId,
//     };

//     set({
//       nodes: [
//         ...get().nodes.map((cur) => {
//           if (cur.id !== prevId) return cur;
//           return { ...cur, data: { ...cur.data, isAddableFlow: false } };
//         }),
//         newNode,
//       ],
//       edges: [...get().edges, newEdge],
//     });
//     return newNodeId;
//   },
//   addQuestionFlow: (prevId) => {
//     const newNodeId = String(Number(get().nodes[get().nodes.length - 1].id) + 1);
//     const prevNode = get().nodes.find((cur) => cur.id === prevId);
//     if (!prevNode) return "";

//     const newNode = {
//       id: newNodeId,
//       type: "questionNode",
//       data: { label: `Flow${newNodeId}`, questions: [], isAddableFlow: true },
//       position: { x: prevNode.position.x, y: prevNode.position.y + 150 },
//     };
//     const newEdge = {
//       id: `e${Number(prevNode.id)}-${newNodeId}`,
//       source: prevNode.id,
//       target: newNodeId,
//     };
//     set({
//       nodes: [
//         ...get().nodes.map((cur) => {
//           if (cur.id !== prevId) return cur;
//           return { ...cur, data: { ...cur.data, isAddableFlow: false } };
//         }),
//         newNode,
//       ],
//       edges: [...get().edges, newEdge],
//     });
//     return newNodeId;
//   },
//   deleteFlow: (nodeId) => {
//     const prevId = get().edges.find((cur) => cur.target === nodeId)?.source;
//     const prevNode = get().nodes.find((cur) => cur.id === prevId);

//     set({
//       nodes: get()
//         .nodes.filter((cur) => cur.id !== nodeId)
//         .map((cur) => {
//           if (!prevId || cur.id !== prevId) return cur;
//           if (cur.type !== "questionNode") return { ...cur, data: { ...cur.data, isAddableFlow: true } };
//           return {
//             ...cur,
//             data: {
//               ...cur.data,
//               isAddableFlow: true,
//               questions: cur.data.questions.filter((cur: types.TQuestion) => {
//                 return cur.nextNodeId !== nodeId;
//               }),
//             },
//           };
//           // return cur;
//         }),
//       edges: get().edges.filter((cur) => cur.source !== nodeId && cur.target !== nodeId),
//     });
//   },
//   addFlowText: () => {
//     if (!get().inputFlowText) return;
//     set((state) => ({
//       inputFlowTextArray: [...state.inputFlowTextArray, state.inputFlowText],
//       inputFlowText: "",
//     }));
//   },
//   removeFlowText: () => {
//     set((state) => ({
//       inputFlowTextArray: [
//         ...state.inputFlowTextArray.slice(0, state.modifyFlowTextIndex),
//         ...state.inputFlowTextArray.slice(state.modifyFlowTextIndex + 1, state.inputFlowTextArray.length),
//       ],
//       isEditFlowText: false,
//     }));
//   },
//   editFlowText: () => {
//     set((state) => ({
//       inputFlowTextArray: [
//         ...state.inputFlowTextArray.map((cur: string, index: number) => {
//           if (index === state.modifyFlowTextIndex) {
//             return state.inputModifyFlowText;
//           }
//           return cur;
//         }),
//       ],
//       isEditFlowText: false,
//     }));
//   },
//   setIsEditFlowText: (isOpen, index) => {
//     isOpen
//       ? set((state) => ({
//           isEditFlowText: true,
//           modifyFlowTextIndex: index,
//           inputModifyFlowText: state.inputFlowTextArray?.[index],
//         }))
//       : set({ isEditFlowText: false });
//   },
//   makeDialogData: () => {
//     const flowsData: types.TFlow[] = [];

//     get().nodes.forEach((node) => {
//       const style: "speak" | "question" = node.type === "speakNode" ? "speak" : "question";
//       const avatarPosition = node.data.avatarPosition?.toLowerCase() || "left";

//       const texts: string[] = [];
//       if (node.type === "speakNode") {
//         node.data.text.forEach((cur: string) => texts.push(cur));
//       } else {
//         node.data.questions.forEach((cur: any) => texts.push(cur.text));
//       }

//       const next = get()
//         .edges.filter((edge) => edge.source === node.id)
//         .map((edge) => edge.target);

//       const flow = {
//         style,
//         avatarPosition,
//         subject: node.id,
//         character: node.data.characterId || undefined,
//         texts,
//         position: [Math.round(node.position.x), Math.round(node.position.y)],
//         next,
//       };
//       // if (node.data.characterId) flow = { ...flow, character: node.data.characterId };
//       flowsData.push(flow);
//     });

//     return {
//       title: get().inputTitle,
//       characters: [],
//       position: [5000, 5000],
//       flows: flowsData,
//     };
//   },
//   createDialog: async () => {
//     const dialogData = get().makeDialogData();
//     await gql.createDialog(dialogData);
//     set((state) => ({ isDialogToolOpen: false, nodes: initialNodes, edges: [], inputTitle: "" }));
//     get().initDialogList();
//   },
//   updateDialog: async () => {
//     const dialogData = get().makeDialogData();
//     await gql.updateDialog(get().dialogId, dialogData);
//     set((state) => ({ isDialogToolOpen: false, nodes: initialNodes, edges: [], inputTitle: "" }));
//     get().initDialogList();
//   },
//   removeDialog: async () => {
//     console.log("remove");
//   },
//   updateSelectedCharacters: (characterId) => {
//     if (get().isSelectedCharacter(characterId)) {
//       set((state) => ({
//         selectedCharacters: state.selectedCharacters.filter((character) => character.id !== characterId),
//       }));
//     } else {
//       const selectedCharacter = get().characters.find((character) => character.id === characterId);
//       if (!selectedCharacter) return;
//       set((state) => ({
//         selectedCharacters: [...state.selectedCharacters, selectedCharacter],
//       }));
//     }
//   },
//   isSelectedCharacter: (characterId) => {
//     return !!get().selectedCharacters.find((character) => character.id === characterId);
//   },
//   setInputCharacterId: (characterId) => {
//     set({ inputCharacterId: characterId });
//   },
// });
