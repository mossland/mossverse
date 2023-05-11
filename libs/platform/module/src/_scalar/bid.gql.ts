import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst, Utils } from "@shared/util";
import { File } from "@shared/module/gql";
import { gql as shared } from "@shared/module";

// import { User } from "../user/user.gql";

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
  @Field(() => [File])
  @Prop([{ type: ObjectId, ref: "file", required: true }])
  images: Id[];
  @Field(() => File, { nullable: true })
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
