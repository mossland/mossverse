import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => gql.Network)
  @Prop({ type: ObjectId, ref: "network", required: true, index: true, immutable: true })
  network: Id;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true, immutable: true })
  address: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  network: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true, default: "user", enum: cnst.walletTypes })
  type: cnst.WalletType;

  @Field(() => [gql.TokenItem])
  @Prop([{ type: gql.TokenItemSchema }])
  items: gql.TokenItem[];

  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.walletStatuses,
    required: true,
    default: "active",
  })
  status: cnst.WalletStatus;
}

// * 최종 생성 모델
@InputType()
export class WalletInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Wallet extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class WalletSchema extends Tail {}
