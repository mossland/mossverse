import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { Network } from "../network/network.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => Network)
  @Prop({ type: ObjectId, ref: "network", required: true, index: true })
  network: Id;

  @Field(() => String)
  @Prop({ type: String, required: true, index: true, unique: true })
  address: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  displayName?: string;
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
  @Prop({
    type: String,
    enum: cnst.contractInterfaces,
    // required: true,
    index: true,
  })
  interface: cnst.ContractInterface;
  //| "erc4907";

  @Field(() => String)
  @Prop({ type: String, required: true, default: "Unnamed" })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true, default: "Unnamed" })
  symbol: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: -1 })
  totalSupply: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: -1 })
  bn: number;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.contractStatuses, required: true, default: "active" })
  status: cnst.ContractStatus;
}

// * 최종 생성 모델
@InputType()
export class ContractInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Contract extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class ContractSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class ContractSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalContract: number;
}
