import graphql from "graphql-tag";
import { cnst } from "@shared/util";
import {
  createGraphQL,
  createFragment,
  Field,
  InputType,
  mutate,
  query,
  ObjectType,
  BaseGql,
  BaseArrayFieldGql,
  Int,
} from "@shared/util-client";
import { gql as shared } from "@shared/data-access";
import { Character } from "../character/character.gql";
import { AvatarPosition, FlowStyle } from "../_scalar/scalar.gql";

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

export const dialogGraphQL = createGraphQL<"dialog", Dialog, DialogInput>(Dialog, DialogInput);
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
  defaultDialog,
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

@ObjectType("Dialogue")
export class Dialogue extends BaseArrayFieldGql(DialogueInput) {}
export const dialogueFragment = createFragment(Dialogue);
