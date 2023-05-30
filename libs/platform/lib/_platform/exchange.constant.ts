import { ApiProperty } from "@nestjs/swagger";
import { BaseArrayField, Id, ObjectId, cnst } from "@util/server";
import { Field, Float, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";
import { v4 as uuidv4 } from "uuid";

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Exchange extends BaseArrayField {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.exchangeTypes, required: true })
  type: cnst.ExchangeType;

  @Field(() => shared.Token, { nullable: true })
  @Prop({ type: ObjectId, ref: "token" })
  token?: Id;

  @Field(() => shared.Thing, { nullable: true })
  @Prop({ type: ObjectId, ref: "thing" })
  thing?: Id;

  @Field(() => shared.Product, { nullable: true })
  @Prop({ type: ObjectId, ref: "product" })
  product?: Id;

  @Field(() => shared.Currency, { nullable: true })
  @Prop({ type: ObjectId, ref: "currency" })
  currency?: Id;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
    required: false,
    default: () => uuidv4(),
    unique: true,
    index: true,
  })
  @ApiProperty({
    example: "1242-abcd-defg-1213",
    description: "Unique ID of Change",
  })
  hash?: string;

  @Field(() => shared.Wallet, { nullable: true })
  @Prop({ type: ObjectId, ref: "wallet", required: false, index: true })
  wallet?: Id;

  @Field(() => Float)
  @Prop({ type: Number, required: true, index: true })
  @ApiProperty({ example: -1, description: "Update Number of Item" })
  value: number;

  @Field(() => Float, { nullable: true })
  @Prop({ type: Number, required: false })
  originalValue?: number;
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
