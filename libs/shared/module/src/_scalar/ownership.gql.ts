import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => gql.Token, { nullable: true })
  @Prop({ type: ObjectId, required: true })
  token?: Id;

  @Field(() => gql.Wallet)
  @Prop({ type: ObjectId, required: true })
  wallet: Id;

  @Field(() => String)
  @Prop({ type: String, required: true })
  address: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false })
  tokenId?: number;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  num: number;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  bn: number;
}
@ObjectType()
@Schema()
export class Ownership extends Base {}
export const OwnershipSchema = SchemaFactory.createForClass(Ownership);
