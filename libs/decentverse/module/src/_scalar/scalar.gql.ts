import { Field, ObjectType, Int, InputType, ID } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { cnst } from "@shared/util";
import { ObjectId, Id, BaseArrayField } from "@shared/util-server";
import * as gql from "../gql";

export const filePurposes = ["asset", "character", "map", "item", "emoji"] as const;
export type FilePurpose = typeof filePurposes[number];

export const webviewPurposes = ["default", "youtube", "image", "twitter"] as const;
export type WebviewPurpose = typeof webviewPurposes[number];

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class Collision extends BaseArrayField {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];
}
@InputType()
export class CollisionInput extends Collision {}
export const CollisionSchema = SchemaFactory.createForClass(Collision);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class Webview extends BaseArrayField {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];

  @Field(() => String)
  @Prop({ type: String })
  url: string;

  @Field(() => [Int])
  @Prop([Number])
  size: number[];

  @Field(() => String)
  @Prop({ type: String, required: true, default: "default", enum: webviewPurposes })
  purpose: WebviewPurpose;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEmbed: boolean;
}
@InputType()
export class WebviewInput extends Webview {}
export const WebviewSchema = SchemaFactory.createForClass(Webview);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class CallRoom extends BaseArrayField {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];

  @Field(() => Int)
  @Prop({ type: Number, required: true, default: 100 })
  maxNum: number;

  @Field(() => String)
  @Prop({ type: String, default: "call", enum: cnst.roomTypes })
  roomType: cnst.RoomType;
}
@InputType()
export class CallRoomInput extends CallRoom {}
export const CallRoomSchema = SchemaFactory.createForClass(CallRoom);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class Live extends BaseArrayField {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  errorMessage?: string;

  @Field(() => [Int])
  @Prop([Number])
  center: number[];

  @Field(() => [Int])
  @Prop([Number])
  wh: number[];

  @Field(() => String)
  @Prop({ type: String })
  src: string;
}
@InputType()
export class LiveInput extends Live {}
export const LiveSchema = SchemaFactory.createForClass(Live);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class MapConfig {
  @Field(() => Boolean, { nullable: false })
  @Prop({ type: Boolean, required: true, default: true })
  dayNight: boolean;
}
@InputType()
export class MapConfigInput extends MapConfig {}
export const MapConfigSchema = SchemaFactory.createForClass(MapConfig);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class SpriteDef {
  @Field(() => Int)
  @Prop({ type: Number, required: true })
  row: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  column: number;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  duration: number;
}

@InputType()
export class SpriteDefInput extends SpriteDef {}
export const SpriteDefSchema = SchemaFactory.createForClass(SpriteDef);

@InputType({ isAbstract: true })
@ObjectType()
@Schema()
export class Sprite {
  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  idle: SpriteDef;

  @Field(() => SpriteDef)
  @Prop({ type: SpriteDefSchema, required: true })
  walk: SpriteDef;
}

@InputType()
export class SpriteInput extends Sprite {
  @Field(() => SpriteDefInput)
  idle: SpriteDefInput;

  @Field(() => SpriteDefInput)
  walk: SpriteDefInput;
}
export const SpriteSchema = SchemaFactory.createForClass(Sprite);
