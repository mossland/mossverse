import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Id, ObjectId } from "@util/server";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
export class Base {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;

  @Field(() => shared.Wallet)
  @Prop({ type: ObjectId, ref: "wallet", required: true })
  wallet: Id;

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
  @Field(() => ID)
  wallet: Id;
}
@InputType()
export class StakingInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
@Schema()
export class Staking extends Base {}
export const StakingSchema = SchemaFactory.createForClass(Staking);
