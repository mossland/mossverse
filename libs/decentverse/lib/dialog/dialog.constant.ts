import { BaseField, Id, ObjectId } from "@util/server";
import { Character } from "../character/character.constant";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Flow, FlowInput, FlowSchema } from "../_decentverse/flow.constant";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  title: string;

  @Field(() => [Character])
  @Prop([{ type: ObjectId, required: true }])
  characters: Id[];

  @Field(() => [Flow])
  @Prop([{ type: FlowSchema }])
  flows: Flow[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => [ID])
  characters: Id[];
  @Field(() => [FlowInput])
  flows: FlowInput[];
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "active",
  })
  status: "active" | "inactive";
}

// * 최종 생성 모델
@InputType()
export class DialogInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Dialog extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class DialogSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class DialogSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalDialog: number;
}
