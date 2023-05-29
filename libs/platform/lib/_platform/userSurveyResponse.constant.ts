import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType, OmitType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  answer?: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  selection?: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  reason?: string;

  @Field(() => Float)
  @Prop({ type: Number })
  num: number;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user: Id;
}
@InputType()
export class UserSurveyResponseInput extends OmitType(IntersectionType(InputOverwrite, Base, InputType), ["num"]) {}
@Schema()
@ObjectType()
export class UserSurveyResponse extends Base {}

export const UserSurveyResponseSchema = SchemaFactory.createForClass(UserSurveyResponse);
