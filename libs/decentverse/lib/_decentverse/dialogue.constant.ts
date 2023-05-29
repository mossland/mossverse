import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Dialog } from "../dialog/dialog.constant";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

  @Field(() => Dialog)
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
