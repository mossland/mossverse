import { Field, ObjectType, Int, Float, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import { gql as shared } from "@shared/module";

@ObjectType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, required: true })
  user: Id;

  @Field(() => Float)
  @Prop({ type: Number, required: true })
  num: number;
}
@ObjectType()
@Schema()
export class MocOwnership extends Base {}
export const MocOwnershipSchema = SchemaFactory.createForClass(MocOwnership);
