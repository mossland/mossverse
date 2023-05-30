import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

// import { User } from "../user/user.constant";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
export class Bid extends BaseArrayField {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;
  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  value: number;
  @Field(() => [shared.File])
  @Prop([{ type: ObjectId, ref: "file", required: true }])
  images: Id[];
  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  video?: Id;
}

@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user: Id;

  @Field(() => [ID])
  images: Id[];

  @Field(() => ID)
  video: Id;
}

@InputType()
export class BidInput extends IntersectionType(InputOverwrite, Bid, InputType) {}
export const BidSchema = SchemaFactory.createForClass(Bid);
