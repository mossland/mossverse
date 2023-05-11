import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import { gql as shared } from "@shared/module";

export const flowStyles = ["speak", "question"] as const;
export type FlowStyle = typeof flowStyles[number];

export const avatarPositions = ["left", "right", "center"] as const;
export type AvatarPosition = typeof avatarPositions[number];

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Flow extends BaseArrayField {
  @Field(() => String)
  @Prop({ type: String, enum: flowStyles, default: "speak", required: true })
  style: FlowStyle;

  @Field(() => String)
  @Prop({ type: String, required: true })
  subject: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, ref: "character", required: false })
  character?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  image?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  background?: Id;

  @Field(() => String)
  @Prop({ type: String, enum: avatarPositions, required: true, default: "right" })
  avatarPosition: AvatarPosition;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  name?: string;

  @Field(() => [String])
  @Prop([{ type: String, required: true }])
  texts: string[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true }])
  position: number[];

  @Field(() => [String], { nullable: true })
  @Prop([{ type: String, required: false }])
  next?: string[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  image?: Id;
  @Field(() => ID, { nullable: true })
  background?: Id;
}

@InputType()
export class FlowInput extends IntersectionType(InputOverwrite, Flow, InputType) {}
export const FlowSchema = SchemaFactory.createForClass(Flow);
