import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Id, validate } from "@shared/util-server";
import * as gql from "../gql";

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class ShipInfo {
  @Field(() => String)
  @Prop({ type: String, required: true })
  siteName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, validate: validate.phone, required: true })
  phone: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  zipcode: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  address: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  message?: string;
}
@InputType()
export class ShipInfoInput extends ShipInfo {}
export const ShipInfoSchema = SchemaFactory.createForClass(ShipInfo);
