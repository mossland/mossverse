import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import { gql as shared } from "@shared/module";
import { Dialogue, DialogueInput, DialogueSchema } from "../_scalar/dialogue.gql";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  top?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  wall?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  bottom?: Id;

  @Field(() => shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  lighting?: Id;

  // @Field(() => [Collision])
  // @Prop([{ type: CollisionSchema }])
  // collisions: Collision[];

  // @Field(() => [Webview])
  // @Prop([{ type: WebviewSchema }])
  // webviews: Webview[];

  // @Field(() => [Dialogue])
  // @Prop([{ type: DialogueSchema }])
  // dialogues: Dialogue[];

  // @Field(() => [Live])
  // @Prop([{ type: LiveSchema }])
  // lives: Live[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  top?: Id;
  @Field(() => ID, { nullable: true })
  wall?: Id;
  @Field(() => ID, { nullable: true })
  bottom?: Id;
  @Field(() => ID, { nullable: true })
  lighting?: Id;
  // @Field(() => [CollisionInput])
  // collisions: CollisionInput[];
  // @Field(() => [WebviewInput])
  // webviews: WebviewInput[];
  // @Field(() => [DialogueInput])
  // dialogues: DialogueInput[];
  // @Field(() => [LiveInput])
  // lives: LiveInput[];
}
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Tail extends Base {
  @Field(() => [Int])
  @Prop([{ type: Number, required: true, min: 1 }])
  wh: number[];

  @Field(() => String)
  @Prop({ type: String, enum: ["active", "inactive"], required: true, default: "active" })
  status: "active" | "inactive";
}
@InputType()
export class AssetInput extends IntersectionType(InputOverwrite, Base, InputType) {}
@ObjectType()
export class Asset extends IntersectionType(BaseGql(Base), Tail) {}
@Schema()
export class AssetSchema extends Tail {}

// * 4. 데이터 모니터링을 위한 Summary 모델
@ObjectType({ isAbstract: true })
@Schema()
export class AssetSummary {
  @Field(() => Int)
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalAsset: number;
}
