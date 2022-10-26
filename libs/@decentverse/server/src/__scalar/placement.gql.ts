import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Placement extends BaseArrayField {
  @Field(() => gql.Asset)
  @Prop({ type: ObjectId, required: true, ref: "asset" })
  asset: Id;

  @Field(() => [Int])
  @Prop([{ type: Number, required: true, min: 0 }])
  center: number[];

  @Field(() => [Int])
  @Prop([{ type: Number, required: true, min: 0 }])
  wh: number[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  asset: Id;
}

@InputType()
export class PlacementInput extends IntersectionType(InputOverwrite, Placement, InputType) {}
export const PlacementSchema = SchemaFactory.createForClass(Placement);
