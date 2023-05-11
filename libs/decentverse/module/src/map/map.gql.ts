import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType, PartialType } from "@nestjs/graphql";
import { gql as shared } from "@shared/module";
import {
  MapConfig,
  MapConfigInput,
  MapConfigSchema,
  MapPosition,
  MapPositionSchema,
  MapPositionInput,
} from "../_scalar/scalar.gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  splash?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  logo?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, required: false })
  miniView?: Id;

  @Field(() => [Float])
  @Prop({ type: [Number], required: true, default: [0, 0] })
  startPosition: number[];

  @Field(() => [MapPosition])
  @Prop([{ type: MapPositionSchema, required: true }])
  spawnPositions: MapPosition[];

  @Field(() => MapConfig)
  @Prop({ type: MapConfigSchema })
  config: MapConfig;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  splash?: Id;
  @Field(() => ID, { nullable: true })
  logo?: Id;
  @Field(() => ID, { nullable: true })
  miniView?: Id;
  @Field(() => [MapPositionInput])
  spawnPositions: MapPositionInput[];
  @Field(() => MapConfigInput)
  config: MapConfigInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [Float])
  @Prop([{ type: Number, required: true, default: 0 }])
  wh: number[];

  @Field(() => String)
  @Prop({
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "active",
  })
  status: "active" | "inactive";
}

// * 최종 생성 모델
@InputType()
export class MapInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Map extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class MapSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class MapSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalMap: number;
}
