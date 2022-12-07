import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Hotkey extends BaseArrayField {
  @Field(() => String)
  @Prop({ type: String, required: true })
  key: string;

  @Field(() => gql.Emoji)
  @Prop([{ type: ObjectId, ref: "emoji", required: true }])
  emoji: Id;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  emoji: Id;
}

@InputType()
export class HotkeyInput extends IntersectionType(InputOverwrite, Hotkey, InputType) {}
export const HotkeySchema = SchemaFactory.createForClass(Hotkey);
