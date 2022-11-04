import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Dialogue extends BaseArrayField {
  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];

  @Field(() => gql.Dialog)
  @Prop({ type: ObjectId, required: true })
  dialog: Id;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  dialog: Id;
}

@InputType()
export class DialogueInput extends IntersectionType(InputOverwrite, Dialogue, InputType) {}
export const DialogueSchema = SchemaFactory.createForClass(Dialogue);
