import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Area extends BaseArrayField {
  @Field(() => gql.Map)
  @Prop({ type: ObjectId, required: true, ref: "map" })
  map: Id;

  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  map: Id;
}

@InputType()
export class AreaInput extends IntersectionType(InputOverwrite, Area, InputType) {}
export const AreaSchema = SchemaFactory.createForClass(Area);
