import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Contract } from "../contract/contract.constant";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { File } from "../file/file.constant";
import { OpenSeaMeta, OpenSeaMetaSchema } from "../_shared/shared.constant";
import { Prop, Schema } from "@nestjs/mongoose";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => Contract)
  @Prop({
    type: ObjectId,
    required: true,
    ref: "contract",
    index: true,
    immutable: true,
  })
  contract: Id;

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false, index: true, immutable: true })
  tokenId?: number;

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
  @Field(() => ID, { nullable: true })
  contract: Id;
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
    enum: cnst.tokenPurposes,
  })
  purpose: cnst.TokenPurpose;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date(0) })
  lockUntil: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  uri?: string;

  @Field(() => OpenSeaMeta, { nullable: true })
  @Prop({ type: OpenSeaMetaSchema, required: false })
  meta?: OpenSeaMeta;

  @Field(() => File, { nullable: true })
  @Prop({ type: ObjectId, required: false, ref: "file", index: true })
  image?: Id;

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.tokenStatuses,
    required: true,
    default: "active",
  })
  status: cnst.TokenStatus;
}

// * 최종 생성 모델
@InputType()
export class TokenInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Token extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class TokenSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class TokenSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalToken: number;
}
