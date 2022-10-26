import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => gql.Thing)
  @Prop({ type: ObjectId })
  thing: Id;

  @Field(() => Number)
  @Prop({ type: Number })
  num: number;
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  thing: Id;
}

@InputType()
export class ThingItemInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
@Schema()
export class ThingItem extends Base {}
export const ThingItemSchema = SchemaFactory.createForClass(ThingItem);
