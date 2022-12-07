import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => gql.shared.User)
  @Prop({ type: ObjectId, required: true })
  user: Id;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  num: number;
}
@ObjectType()
@Schema()
export class MocOwnership extends Base {}
export const MocOwnershipSchema = SchemaFactory.createForClass(MocOwnership);
