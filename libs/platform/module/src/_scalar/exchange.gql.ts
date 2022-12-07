import { Field, ObjectType, Int, InputType, ID, IntersectionType, Float, OmitType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { cnst } from "@shared/util";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
import { v4 as uuidv4 } from "uuid";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Exchange extends BaseArrayField {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.exchangeTypes, required: true })
  type: cnst.ExchangeType;

  @Field(() => gql.shared.Token, { nullable: true })
  @Prop({ type: ObjectId, ref: "token" })
  token?: Id;

  @Field(() => gql.shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, ref: "thing" })
  thing?: Id;

  @Field(() => gql.shared.Product, { nullable: true })
  @Prop({ type: ObjectId, ref: "product" })
  product?: Id;

  @Field(() => gql.shared.Currency, { nullable: true })
  @Prop({ type: ObjectId, ref: "currency" })
  currency?: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true, default: () => uuidv4(), unique: true, index: true })
  @ApiProperty({ example: "1242-abcd-defg-1213", description: "Unique ID of Change" })
  hash?: string;

  @Field(() => gql.shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  wallet?: Id;

  @Field(() => Float)
  @Prop({ type: Number, required: true, index: true })
  @ApiProperty({ example: -1, description: "Update Number of Item" })
  num: number;

  @Field(() => Float, { nullable: true })
  @Prop({ type: Number, required: false })
  originalNum?: number;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;
  @Field(() => ID, { nullable: true })
  thing?: Id;
  @Field(() => ID, { nullable: true })
  product?: Id;
  @Field(() => ID, { nullable: true })
  currency?: Id;
  @Field(() => ID, { nullable: true })
  wallet?: Id;
}
@InputType()
export class ExchangeInput extends IntersectionType(InputOverwrite, Exchange, InputType) {}
export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
