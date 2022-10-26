import { Field, ObjectType, Int, InputType, ID, IntersectionType, Float, OmitType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { cnst } from "@shared/util";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Schema()
// class Base extends BaseArrayField {
class Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.priceTagTypes, required: true, index: true })
  type: cnst.PriceTagType;

  @Field(() => gql.shared.Token, { nullable: true })
  @Prop({ type: ObjectId, ref: "token", index: true })
  token?: Id;

  @Field(() => gql.shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, ref: "thing", index: true })
  thing?: Id;

  @Field(() => Float)
  @Prop({ type: Number, min: 0, required: true, index: true })
  price: number;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
}
@InputType()
export class PriceTagInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
@Schema()
export class PriceTag extends Base {}
export const PriceTagSchema = SchemaFactory.createForClass(PriceTag);
