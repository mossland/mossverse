import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, IntersectionType, ObjectType, Int, Float } from "@nestjs/graphql";
import { cnst } from "@shared/util";
import { Asset } from "../asset/asset.gql";
import { Map } from "../map/map.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => Map)
  @Prop({ type: ObjectId, required: true, ref: "map" })
  map: Id;

  @Field(() => Asset)
  @Prop({ type: ObjectId, required: true, ref: "asset" })
  asset: Id;

  @Field(() => [Float])
  @Prop([{ type: Number, required: true }])
  center: number[];

  @Field(() => [Float])
  @Prop([{ type: Number, required: true, min: 0 }])
  wh: number[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  map: Id;
  @Field(() => ID)
  asset: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({ type: String, enum: cnst.placementStatuses, required: true, default: "active" })
  status: cnst.PlacementStatus;
}

// * 최종 생성 모델
@InputType()
export class PlacementInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Placement extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class PlacementSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class PlacementSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalPlacement: number;
}
