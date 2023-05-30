import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Map } from "../map/map.constant";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
@InputType({ isAbstract: true })
@Schema()
export class Area extends BaseArrayField {
  @Field(() => Map)
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
