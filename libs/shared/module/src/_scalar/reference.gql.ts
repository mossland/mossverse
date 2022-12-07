import { Field, ObjectType, Int, InputType, ID, IntersectionType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, Id, ObjectId } from "@shared/util-server";
import * as gql from "../gql";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base extends BaseArrayField {
  @Field(() => String)
  @Prop({ type: String, required: true })
  type: string;

  @Field(() => ID)
  @Prop({ type: ObjectId, refPath: "refs.type", required: true })
  ref: Id;
}
@InputType({ isAbstract: true })
class InputOverwrite {}

@InputType()
export class ReferenceInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
@Schema()
export class Reference extends Base {}
export const ReferenceSchema = SchemaFactory.createForClass(Reference);
