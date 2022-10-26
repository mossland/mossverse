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
  @Field(() => gql.Contract)
  @Prop({ type: ObjectId, required: true, ref: "contract", index: true, immutable: true })
  contract: Id;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false, index: true, immutable: true })
  tokenId?: number;

  @Field(() => gql.TokenProfile, { nullable: true })
  @Prop({ type: gql.TokenProfileSchema })
  profile?: gql.TokenProfile;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  contract: Id;
  @Field(() => gql.TokenProfileInput, { nullable: true })
  profile?: gql.TokenProfileInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true, default: "general", enum: cnst.tokenTypes })
  type: cnst.TokenType;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date(0) })
  lockUntil: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  uri?: string;

  @Field(() => gql.OpenSeaMeta, { nullable: true })
  @Prop({ type: gql.OpenSeaMetaSchema, required: false })
  meta?: gql.OpenSeaMeta;

  @Field(() => gql.File, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "file", index: true })
  image?: Id;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.tokenStatuses, required: true, default: "active" })
  status: cnst.TokenStatus;
}

// * 최종 생성 모델
@InputType()
export class TokenInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Token extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class TokenSchema extends Tail {}
