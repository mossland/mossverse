import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { File } from "../file/file.constant";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: false, default: "Default Name" })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: false, default: "Default Description" })
  description: string;

  @Field(() => File)
  @Prop({ type: ObjectId, required: true, ref: "file", index: true })
  image: Id;

  @Field(() => ID, { nullable: true })
  @Prop({ type: ObjectId, required: false, refPath: "rootType" })
  root?: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, immutable: true })
  rootType?: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  image: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    index: true,
    default: "item",
    enum: cnst.thingPurposes,
  })
  purpose: cnst.ThingPurpose;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.thingStatuses,
    required: true,
    default: "active",
  })
  status: cnst.ThingStatus;
}

// * 최종 생성 모델
@InputType()
export class ThingInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Thing extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class ThingSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ThingSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalThing: number;
}
