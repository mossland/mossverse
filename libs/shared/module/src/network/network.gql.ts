import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { cnst } from "@shared/util";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, index: true, unique: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  endPoint: string;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.networkTypes, required: true })
  type: cnst.NetworkType;

  @Field(() => String)
  @Prop({ type: String, enum: cnst.networkProviders, required: true, unique: true })
  provider: cnst.NetworkProvider;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  networkId: number;
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
  @Prop({ type: String, enum: cnst.networkStatuses, required: true, default: "active" })
  status: cnst.NetworkStatus;
}

// * 최종 생성 모델
@InputType()
export class NetworkInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Network extends IntersectionType(BaseGql(Base), Tail, ObjectType) {}
@Schema()
export class NetworkSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class NetworkSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalNetwork: number;
}
