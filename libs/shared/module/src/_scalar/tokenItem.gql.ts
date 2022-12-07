import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => ID) //* 캐시용 필드, Resolve하지 않음
  @Prop({ type: ObjectId, required: true, index: true })
  contract: Id;

  @Field(() => gql.Token)
  @Prop({ type: ObjectId, required: true, index: true })
  token: Id;

  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  num: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  bn: number;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  token: Id;
}

@InputType()
export class TokenItemInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
@Schema()
export class TokenItem extends Base {}
export const TokenItemSchema = SchemaFactory.createForClass(TokenItem);
