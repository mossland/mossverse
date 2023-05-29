import { BaseField, Id, ObjectId } from "@util/server";
import { Field, Float, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { Map } from "../map/map.constant";
import { Prop, Schema } from "@nestjs/mongoose";
import { cnst } from "@util/server";
import { cnst as shared } from "@shared/server";
// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => Map)
  @Prop({ type: ObjectId, ref: "map", required: true })
  map: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  top?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  wall?: Id;

  @Field(() => shared.File)
  @Prop({ type: ObjectId, ref: "file", required: true })
  bottom: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  lighting?: Id;

  @Field(() => [Float], { defaultValue: [0, 0] })
  @Prop([Number])
  center: number[];

  @Field(() => [Float], { defaultValue: [100, 100] })
  @Prop([Number])
  wh: number[];
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID)
  map: Id;
  @Field(() => ID, { nullable: true })
  top?: Id;
  @Field(() => ID, { nullable: true })
  wall?: Id;
  @Field(() => ID)
  bottom: Id;
  @Field(() => ID, { nullable: true })
  lighting?: Id;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => String)
  @Prop({
    type: String,
    enum: cnst.tileStatuses,
    required: true,
    default: "active",
  })
  status: cnst.TileStatus;
}

// * 최종 생성 모델
@InputType()
export class TileInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Tile extends IntersectionType(BaseField(Base), Tail) {}
@Schema()
export class TileSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class TileSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalTile: number;
}
