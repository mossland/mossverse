import { BaseArrayField, Id, ObjectId } from "@util/server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
export class Entry extends BaseArrayField {
  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;

  @Field(() => Number)
  @Prop({ type: Number, required: true, default: 0 })
  value: number;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date, required: false })
  expireAt?: Date;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user: Id;
}

@InputType()
export class EntryInput extends IntersectionType(InputOverwrite, Entry, InputType) {}
export const EntrySchema = SchemaFactory.createForClass(Entry);
