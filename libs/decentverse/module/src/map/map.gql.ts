import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId, validate } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType, PartialType } from "@nestjs/graphql";
import * as gql from "../gql";

// * 1. 보안필드를 제외한 모든 필드
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 2000 })
  tileSize: number;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  top?: Id;

  @Field(() => gql.shared.File)
  @Prop({ type: ObjectId, ref: "file", required: true })
  bottom: Id;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  lighting?: Id;

  @Field(() => [gql.Placement], { nullable: true })
  @Prop([{ type: gql.PlacementSchema }])
  placements: gql.Placement[];

  @Field(() => [gql.Collision])
  @Prop([{ type: gql.CollisionSchema }])
  collisions: gql.Collision[];

  @Field(() => [gql.Webview])
  @Prop([{ type: gql.WebviewSchema }])
  webviews: gql.Webview[];

  @Field(() => [gql.Live])
  @Prop([{ type: gql.LiveSchema }])
  lives: gql.Live[];

  @Field(() => [gql.CallRoom], { nullable: true })
  @Prop([{ type: gql.CallRoomSchema }])
  callRooms: gql.CallRoom[];

  @Field(() => [gql.Dialogue], { nullable: true })
  @Prop([{ type: gql.DialogueSchema }])
  dialogues: gql.Dialogue[];

  @Field(() => gql.MapConfig)
  @Prop({ type: gql.MapConfigSchema })
  config: gql.MapConfig;
}

// * 2. 다른 필드를 참조하는 값 Input형식으로 덮어씌우기
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  top?: Id;
  @Field(() => ID)
  bottom: Id;
  @Field(() => ID, { nullable: true })
  lighting?: Id;
  @Field(() => [gql.PlacementInput], { nullable: true })
  placements: gql.PlacementInput[];
  @Field(() => [gql.CollisionInput])
  collisions: gql.CollisionInput[];
  @Field(() => [gql.WebviewInput])
  webviews: gql.WebviewInput[];
  @Field(() => [gql.LiveInput])
  lives: gql.LiveInput[];
  @Field(() => [gql.CallRoomInput], { nullable: true })
  callRooms: gql.CallRoomInput[];
  @Field(() => [gql.DialogueInput], { nullable: true })
  dialogues: gql.DialogueInput[];
  @Field(() => gql.MapConfigInput)
  config: gql.MapConfigInput;
}

// * 3. 보안필드, default 필드 생성 필수
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [[gql.Tile]], { nullable: true })
  @Prop([[{ type: gql.TileSchema }]])
  tiles: gql.Tile[][];

  @Field(() => [Int])
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
