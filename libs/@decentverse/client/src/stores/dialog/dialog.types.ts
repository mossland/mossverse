import { Nullable } from "@shared/util-client";
import gql from "graphql-tag";
import * as types from "../types";
import { characterFragment } from "../character/character.types";
import { flowFragment } from "../_scalar";
export type DialogInput = {
  title: string;
  characters: string[];
  flows: types.FlowInput[];
};
export type Dialog = {
  id: types.ID;
  title: string;
  characters: types.Character[];
  flows: types.Flow[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
export const defaultDialog: Nullable<Dialog> = {
  id: null,
  title: null,
  characters: [],
  flows: [],
  status: null,
  createdAt: null,
  updatedAt: null,
};
export const purifyDialog = (dialog: Dialog): DialogInput => ({
  title: dialog.title,
  characters: dialog.characters.map((character) => character.id),
  flows: dialog.flows.map((flow) => types.purifyFlow(flow)),
});
export const dialogFragment = gql`
  ${characterFragment}
  ${flowFragment}
  fragment dialogFragment on Dialog {
    id
    title
    characters {
      ...characterFragment
    }
    flows {
      ...flowFragment
    }
    status
    createdAt
    updatedAt
  }
`;

export type Dialogue = {
  id: types.ID;
  center: [number, number];
  wh: [number, number];
  dialog: types.Dialog;
};
export type DialogueInput = {
  center: [number, number];
  wh: [number, number];
  dialog: types.ID;
};
export const dialogueFragment = gql`
  ${dialogFragment}
  fragment dialogueFragment on Dialogue {
    id
    center
    wh
    dialog {
      ...dialogFragment
    }
  }
`;

export const purifyDialogue = (dialogue: Dialogue): DialogueInput => ({
  center: dialogue.center,
  wh: dialogue.wh,
  dialog: dialogue.dialog.id,
});
