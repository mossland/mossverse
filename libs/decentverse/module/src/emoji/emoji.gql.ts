import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, default: "Default Emoji", index: true })
  name: string;

  @Field(() => gql.shared.Token, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "token", index: true })
  token?: Id;

  @Field(() => gql.shared.File)
  @Prop({ type: ObjectId, required: true, ref: "file" })
  file: Id;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  token?: Id;

  @Field(() => ID)
  file: Id;
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
export class EmojiInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Emoji extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class EmojiSchema extends Tail {}
