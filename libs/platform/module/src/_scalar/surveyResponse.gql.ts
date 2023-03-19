import { Field, ObjectType, Int, InputType, ID, IntersectionType, Float, OmitType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import { gql as shared } from "@shared/module";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => shared.Wallet)
  @Prop({ type: ObjectId, ref: "wallet", required: true })
  wallet: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  answer?: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  selection?: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  reason?: string;

  @Field(() => Float, { nullable: true })
  @Prop({ type: String, required: false, default: 0 })
  tokenNum: number;

  @Field(() => [shared.Token])
  @Prop([{ type: ObjectId, ref: "token" }])
  tokens: Id[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  wallet: Id;
}
@InputType()
export class SurveyResponseInput extends OmitType(IntersectionType(InputOverwrite, Base, InputType), [
  "tokenNum",
  "tokens",
]) {}
@ObjectType()
@Schema()
export class SurveyResponse extends Base {}
export const SurveyResponseSchema = SchemaFactory.createForClass(SurveyResponse);
