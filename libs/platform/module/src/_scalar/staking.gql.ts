import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseArrayField, BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst, Utils } from "@shared/util";
import { gql as shared } from "@shared/module";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
export class Staking extends BaseArrayField {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;

  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  @Field(() => Date)
  @Prop({ type: Date, default: new Date(), required: true })
  stakingAt: Date;

  @Field(() => Date)
  @Prop({ type: Date, required: false })
  expireAt?: Date;
}

@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user: Id;
}

@InputType()
export class StakingInput extends IntersectionType(InputOverwrite, Staking, InputType) {}
export const StakingSchema = SchemaFactory.createForClass(Staking);
