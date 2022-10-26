import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import * as gql from "../gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => ID)
  @Prop({ type: String, required: true, unique: true, index: true })
  accountId: string;

  @Field(() => String)
  @Prop({
    type: String,
    validate: validate.email,
    required: true,
    index: true,
  })
  email: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: true, select: false })
  password?: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.adminRoles, required: true, default: "admin" })
  role: cnst.AdminRole;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.adminStatuses, required: true, default: "active" })
  status: cnst.AdminStatus;
}

// * 최종 생성 모델
@InputType()
export class AdminInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Admin extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class AdminSchema extends Tail {}
