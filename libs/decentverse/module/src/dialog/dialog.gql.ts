import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true })
  title: string;

  @Field(() => [gql.Character])
  @Prop([{ type: ObjectId, required: true }])
  characters: Id[];

  @Field(() => [gql.Flow])
  @Prop([{ type: gql.FlowSchema }])
  flows: gql.Flow[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => [ID])
  characters: Id[];
  @Field(() => [gql.FlowInput])
  flows: gql.FlowInput[];
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
export class Dialog extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class DialogSchema extends Tail {}
