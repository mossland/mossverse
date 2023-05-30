import { BaseField, Id, ObjectId, cnst } from "@util/server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { cnst as shared } from "@shared/server";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    immutable: true,
    unique: true,
    index: true,
  })
  address: string;

  @Field(() => shared.User, { nullable: true })
  @Prop({
    type: ObjectId,
    required: false,
    unique: true,
    ref: "user",
    index: true,
  })
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
  @Prop({
    type: String,
    enum: cnst.mocWalletStatuses,
    required: true,
    default: "active",
  })
  status: cnst.MocWalletStatus;

  @Field(() => Date)
  @Prop({ type: Date, required: true, default: new Date() })
  expireAt: Date;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    index: true,
    default: "general",
    enum: cnst.mocWalletTypes,
  })
  type: cnst.MocWalletType;
}

// * 최종 생성 모델
@InputType()
export class MocWalletInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class MocWallet extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class MocWalletSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class MocWalletSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalMocWallet: number;
}
