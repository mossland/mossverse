import { Prop, Schema } from "@nestjs/mongoose";
import { BaseGql, dbConfig, Id, ObjectId } from "@shared/util-server";
import { Field, ID, InputType, Int, IntersectionType, ObjectType } from "@nestjs/graphql";
import * as gql from "../gql";

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
@Schema()
class Base {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  top?: Id;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  bottom?: Id;

  @Field(() => gql.shared.File, { nullable: true })
  @Prop({ type: ObjectId, ref: "file", required: false })
  lighting?: Id;

  @Field(() => [gql.Collision])
  @Prop([{ type: gql.CollisionSchema }])
  collisions: gql.Collision[];

  @Field(() => [gql.Webview])
  @Prop([{ type: gql.WebviewSchema }])
  webviews: gql.Webview[];

  @Field(() => [gql.Dialogue])
  @Prop([{ type: gql.DialogueSchema }])
  dialogues: gql.Dialogue[];

  @Field(() => [gql.Live])
  @Prop([{ type: gql.LiveSchema }])
  lives: gql.Live[];
}
@InputType({ isAbstract: true })
class InputOverwrite {
  @Field(() => ID, { nullable: true })
  top?: Id;
  @Field(() => ID, { nullable: true })
  bottom?: Id;
  @Field(() => ID, { nullable: true })
  lighting?: Id;
  @Field(() => [gql.CollisionInput])
  collisions: gql.CollisionInput[];
  @Field(() => [gql.WebviewInput])
  webviews: gql.WebviewInput[];
  @Field(() => [gql.DialogueInput])
  dialogues: gql.DialogueInput[];
  @Field(() => [gql.LiveInput])
  lives: gql.LiveInput[];
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
