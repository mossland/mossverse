import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

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
