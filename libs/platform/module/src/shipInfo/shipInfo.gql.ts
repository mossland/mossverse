import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType, Int } from "@nestjs/graphql";
import { gql as shared } from "@shared/module";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, default: "" })
  name: string;

  @Field(() => String)
  @Prop({ type: String, validate: validate.phone, required: true })
  phone: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  address: string;

  @Field(() => shared.User)
  @Prop({ type: ObjectId, ref: "user", required: true })
  user: Id;

  @Field(() => shared.Product)
  @Prop({ type: ObjectId, ref: "product", required: true })
  product: Id;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, default: "" })
  siteName?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false, default: "" })
  zipcode?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  user?: Id;
  @Field(() => ID)
  product?: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.shipInfoStatuses, required: true, default: "active" })
  status: cnst.ShipInfoStatus;
}

// * 최종 생성 모델
@InputType()
export class ShipInfoInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class ShipInfo extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ShipInfoSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ShipInfoSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalShipInfo: number;
}
