import {
  BaseArrayFieldGql,
  BaseGql,
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  cnst,
  createFragment,
  createGraphQL,
} from "@util/client";
import { Character } from "../character/character.fetch";
import { fetch as shared } from "@shared/client";

@InputType("FlowInput")
export class FlowInput {
  @Field(() => String)
  style: FlowStyle;

  @Field(() => String)
  subject: string;

  // @Field(() => Character, { nullable: true })
  // character: Character | null;

  @Field(() => shared.File, { nullable: true })
  image: shared.File | null;

  @Field(() => shared.File, { nullable: true })
  background: shared.File | null;

  @Field(() => String)
  avatarPosition: AvatarPosition;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => [String])
  texts: string[];

  @Field(() => [Int])
  position: number[];

  @Field(() => [String])
  next: string[];
}

@ObjectType("Flow")
// export class Flow extends FlowInput {}
export class Flow extends BaseArrayFieldGql(FlowInput) {}
export const flowFragment = createFragment(Flow);

@InputType("DialogInput")
export class DialogInput {
  @Field(() => String)
  title: string;

  @Field(() => [Character])
  characters: Character[];

  @Field(() => [Flow])
  flows: Flow[];
}

@ObjectType("Dialog", { _id: "id" })
export class Dialog extends BaseGql(DialogInput) {
  @Field(() => String)
  status: cnst.DialogStatus;
}

@ObjectType("LightDialog", { _id: "id", gqlRef: "Dialog" })
export class LightDialog extends PickType(Dialog, ["status"] as const) {}

@ObjectType("DialogSummary")
export class DialogSummary {
  @Field(() => Int)
  totalDialog: number;
}

export const dialogGraphQL = createGraphQL("dialog" as const, Dialog, DialogInput, LightDialog);
export const {
  getDialog,
  listDialog,
  dialogCount,
  dialogExists,
  createDialog,
  updateDialog,
  removeDialog,
  dialogFragment,
  purifyDialog,
  crystalizeDialog,
  lightCrystalizeDialog,
  defaultDialog,
  mergeDialog,
} = dialogGraphQL;

@InputType("DialogueInput")
export class DialogueInput {
  @Field(() => [Int])
  center: [number, number];

  @Field(() => [Int])
  wh: [number, number];

  @Field(() => Dialog)
  dialog: Dialog;
}

export const flowStyles = ["speak", "question"] as const;
export type FlowStyle = (typeof flowStyles)[number];

export const avatarPositions = ["left", "right", "center"] as const;
export type AvatarPosition = (typeof avatarPositions)[number];

@ObjectType("Dialogue")
export class Dialogue extends BaseArrayFieldGql(DialogueInput) {}
export const dialogueFragment = createFragment(Dialogue);
