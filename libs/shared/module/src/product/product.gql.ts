import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { cnst } from "@shared/util";

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

  @Field(() => gql.File)
  @Prop({ type: ObjectId, required: true, ref: "file", index: true })
  image: Id;
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
  @Prop({ type: String, enum: cnst.productStatuses, required: true, default: "active" })
  status: cnst.ProductStatus;
}

// * 최종 생성 모델
@InputType()
export class ProductInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Product extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ProductSchema extends Tail {}
