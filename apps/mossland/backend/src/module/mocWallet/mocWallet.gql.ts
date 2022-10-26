import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "./../gql";
import { cnst, Utils } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, immutable: true, unique: true, index: true })
  address: string;

  @Field(() => gql.shared.User, { nullable: true })
  @Prop({ type: ObjectId, required: false, unique: true, ref: "user", index: true })
  user?: Id;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => String)
  address: string;
  @Field(() => ID, { nullable: true })
  user?: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.mocWalletStatuses, required: true, default: "active" })
  status: cnst.MocWalletStatus;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date() })
  expireAt: Date;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true, default: "general", enum: cnst.mocWalletTypes })
  type: cnst.MocWalletType;
}

// * 최종 생성 모델
@InputType()
export class MocWalletInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class MocWallet extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class MocWalletSchema extends Tail {}
